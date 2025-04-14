
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface UseOperatorRegistrationProps {
  gymCode: string | undefined;
}

export const useOperatorRegistration = ({ gymCode }: UseOperatorRegistrationProps) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validateForm = () => {
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
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
        toast.error("Invalid or expired registration code");
        setIsLoading(false);
        return;
      }

      // Verify that the code is for operator role
      const { data: roleData, error: roleError } = await supabase.rpc('get_role_from_code', {
        registration_code: gymCode
      });

      if (roleError) {
        throw roleError;
      }

      if (roleData !== 'operator') {
        toast.error("This code is not valid for operator registration");
        setIsLoading(false);
        return;
      }

      console.log("Registering with role:", roleData);

      // Register the user with explicit operator role
      const userData = {
        full_name: `${firstName} ${lastName}`,
        role: roleData, // Explicitly set the role from the code verification
        gym_id: gymData,
        status: 'pending_approval'
      };

      const { user, error } = await signUp(email, password, userData);

      if (error) {
        throw error;
      }

      if (user) {
        toast.success("Registration successful! Please wait for admin approval.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Error during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    isLoading,
    validationError,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit
  };
};
