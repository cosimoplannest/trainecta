
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface UseInstructorRegistrationProps {
  gymCode: string | undefined;
}

interface Specialty {
  id: string;
  name: string;
  description: string | null;
}

export const useInstructorRegistration = ({ gymCode }: UseInstructorRegistrationProps) => {
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
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      if (!gymCode) return;

      try {
        const { data: gymData } = await supabase.rpc('get_gym_id_from_code', {
          registration_code: gymCode
        });

        if (!gymData) {
          toast.error("Codice palestra non valido");
          return;
        }

        const { data, error } = await supabase
          .from('instructor_specialties')
          .select('*')
          .eq('gym_id', gymData);

        if (error) throw error;
        setSpecialties(data || []);
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast.error("Impossibile caricare le specializzazioni");
      } finally {
        setLoadingSpecialties(false);
      }
    };

    fetchSpecialties();
  }, [gymCode]);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setValidationError("Le password non coincidono");
      return false;
    }
    if (password.length < 6) {
      setValidationError("La password deve contenere almeno 6 caratteri");
      return false;
    }
    if (selectedSpecialties.length === 0) {
      setValidationError("Seleziona almeno una specializzazione");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialtyId)
        ? prev.filter(id => id !== specialtyId)
        : [...prev, specialtyId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Get gym ID from the registration code
      const { data: gymData, error: gymError } = await supabase.rpc('get_gym_id_from_code', {
        registration_code: gymCode
      });

      if (gymError || !gymData) {
        toast.error("Codice di registrazione non valido o scaduto");
        setIsLoading(false);
        return;
      }

      // Verify that the code is for instructor role
      const { data: roleData, error: roleError } = await supabase.rpc('get_role_from_code', {
        registration_code: gymCode
      });

      if (roleError || roleData !== 'instructor') {
        toast.error("Questo codice non è valido per la registrazione come istruttore");
        setIsLoading(false);
        return;
      }

      // Register the user
      const userData = {
        full_name: `${firstName} ${lastName}`,
        role: 'instructor',
        gym_id: gymData
      };

      const { user, error } = await signUp(email, password, userData);

      if (error) {
        throw error;
      }

      if (user) {
        // Create user profile with additional information
        const { error: profileError } = await supabase
          .from('users')
          .update({
            phone,
            status: 'pending_approval'
          })
          .eq('id', user.id);

        if (profileError) {
          throw profileError;
        }

        // Add specialty links
        const specialtyLinks = selectedSpecialties.map(specialtyId => ({
          user_id: user.id,
          specialty_id: specialtyId
        }));

        const { error: specialtyError } = await supabase
          .from('instructor_specialty_links')
          .insert(specialtyLinks);

        if (specialtyError) {
          throw specialtyError;
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

  return {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    isLoading,
    validationError,
    loadingSpecialties,
    specialties,
    selectedSpecialties,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPassword,
    setConfirmPassword,
    handleSpecialtyChange,
    handleSubmit
  };
};
