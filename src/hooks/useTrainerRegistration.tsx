
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface UseTrainerRegistrationProps {
  gymCode: string | undefined;
}

export const useTrainerRegistration = ({ gymCode }: UseTrainerRegistrationProps) => {
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

  const validateForm = () => {
    if (password !== confirmPassword) {
      setValidationError("Le password non coincidono");
      return false;
    }
    if (password.length < 6) {
      setValidationError("La password deve contenere almeno 6 caratteri");
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
      const { data: gymData, error: gymError } = await supabase.rpc('get_gym_id_from_code', {
        registration_code: gymCode
      });

      if (gymError || !gymData) {
        toast.error("Codice di registrazione non valido o scaduto");
        setIsLoading(false);
        return;
      }

      // Verify that the code is for trainer role
      const { data: roleData, error: roleError } = await supabase.rpc('get_role_from_code', {
        registration_code: gymCode
      });

      if (roleError || roleData !== 'trainer') {
        toast.error("Questo codice non è valido per la registrazione come trainer");
        setIsLoading(false);
        return;
      }

      // Register the user
      const userData = {
        full_name: `${firstName} ${lastName}`,
        role: 'trainer',
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
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPassword,
    setConfirmPassword,
    handleSubmit
  };
};
