
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RoleRegistrationForm } from "./RoleRegistrationForm";

interface GenericRegistrationFormProps {
  roleName: string;
  roleId: string;
  showPhoneField?: boolean;
  requiresSpecialties?: boolean;
  gymCode?: string;
}

export const GenericRegistrationForm = ({
  roleName,
  roleId,
  showPhoneField = false,
  requiresSpecialties = false,
  gymCode
}: GenericRegistrationFormProps) => {
  // Remove the useParams call as we're now receiving gymCode as a prop
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);

  // Load specialties if needed
  useState(() => {
    if (requiresSpecialties) {
      const loadSpecialties = async () => {
        setLoadingSpecialties(true);
        try {
          const { data: gymId } = await supabase.rpc('get_gym_id_from_code', {
            registration_code: gymCode
          });

          if (gymId) {
            const { data, error } = await supabase
              .from('instructor_specialties')
              .select('*')
              .eq('gym_id', gymId);

            if (error) throw error;
            setSpecialties(data || []);
          }
        } catch (error) {
          console.error("Error loading specialties:", error);
        } finally {
          setLoadingSpecialties(false);
        }
      };
      
      loadSpecialties();
    }
  });

  const handleSpecialtyChange = (specialtyId: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialtyId)) {
        return prev.filter(id => id !== specialtyId);
      } else {
        return [...prev, specialtyId];
      }
    });
  };

  const validateForm = () => {
    if (password !== confirmPassword) {
      setValidationError("Le password non coincidono");
      return false;
    }
    if (password.length < 6) {
      setValidationError("La password deve contenere almeno 6 caratteri");
      return false;
    }
    if (showPhoneField && (!phone || phone.length < 8)) {
      setValidationError("Inserisci un numero di telefono valido");
      return false;
    }
    if (requiresSpecialties && selectedSpecialties.length === 0) {
      setValidationError("Seleziona almeno una specializzazione");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Get gym ID from the registration code
      const { data: gymId, error: gymError } = await supabase.rpc('get_gym_id_from_code', {
        registration_code: gymCode
      });

      if (gymError || !gymId) {
        toast.error("Codice di registrazione non valido o scaduto");
        setIsLoading(false);
        return;
      }

      // Verify that the code is for the correct role
      const { data: roleData, error: roleError } = await supabase.rpc('get_role_from_code', {
        registration_code: gymCode
      });

      if (roleError || roleData !== roleId) {
        toast.error(`Questo codice non è valido per la registrazione come ${roleName.toLowerCase()}`);
        setIsLoading(false);
        return;
      }

      // Register the user
      const userData = {
        full_name: `${firstName} ${lastName}`,
        role: roleId,
        gym_id: gymId,
        status: 'pending_approval'
      };

      const { user, error } = await signUp(email, password, userData);

      if (error) {
        throw error;
      }

      if (user) {
        // Update user with additional data if needed
        if (showPhoneField || requiresSpecialties) {
          const updates: any = {};
          
          if (showPhoneField) {
            updates.phone = phone;
          }
          
          if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
              .from('users')
              .update(updates)
              .eq('id', user.id);

            if (updateError) {
              throw updateError;
            }
          }
        }
        
        // Add specialties if needed
        if (requiresSpecialties && selectedSpecialties.length > 0) {
          const specialtyLinks = selectedSpecialties.map(specialtyId => ({
            user_id: user.id,
            specialty_id: specialtyId
          }));
          
          const { error: specialtiesError } = await supabase
            .from('instructor_specialty_links')
            .insert(specialtyLinks);
            
          if (specialtiesError) {
            throw specialtiesError;
          }
        }

        toast.success("Registrazione completata con successo! Attendi l'approvazione dell'amministratore.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Errore durante la registrazione");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleRegistrationForm
      firstName={firstName}
      lastName={lastName}
      email={email}
      phone={phone}
      password={password}
      confirmPassword={confirmPassword}
      validationError={validationError}
      isLoading={isLoading}
      setFirstName={setFirstName}
      setLastName={setLastName}
      setEmail={setEmail}
      setPhone={setPhone}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      handleSubmit={handleSubmit}
      loadingSpecialties={loadingSpecialties}
      specialties={specialties}
      selectedSpecialties={selectedSpecialties}
      handleSpecialtyChange={handleSpecialtyChange}
      showPhoneField={showPhoneField}
      roleName={roleName}
      requiresSpecialties={requiresSpecialties}
    />
  );
};
