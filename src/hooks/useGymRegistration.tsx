
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  gymName: string;
  clientVolume: string;
  trainerCount: string;
  address: string;
  phone: string;
  socialLink: string;
}

export const useGymRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    email: "",
    password: "",
    gymName: "",
    clientVolume: "",
    trainerCount: "",
    address: "",
    phone: "",
    socialLink: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Step 1: Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'admin',
            status: 'active'
          }
        }
      });

      if (authError) {
        toast.error(authError.message || "Errore durante la registrazione");
        setIsLoading(false);
        return;
      }

      const userId = authData.user?.id;

      if (!userId) {
        toast.error("Errore: Impossibile creare l'utente");
        setIsLoading(false);
        return;
      }

      // Show registration in progress
      setRegistrationComplete(true);
      
      // Step 2: Use the secure database function to register the gym
      const { data: gymResult, error: gymError } = await supabase.rpc('register_gym', {
        p_gym_name: formData.gymName,
        p_gym_address: formData.address,
        p_gym_phone: formData.phone,
        p_gym_email: formData.email,
        p_gym_website: formData.socialLink,
        p_user_id: userId,
        p_user_full_name: formData.fullName,
        p_user_email: formData.email
      });

      if (gymError) {
        console.error("Gym registration error:", gymError);
        toast.error(`Errore durante la registrazione della palestra: ${gymError.message}`);
        setRegistrationComplete(false);
        
        // Sign out the user if gym registration failed
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // Check if the function returned a success result
      if (!gymResult?.success) {
        console.error("Gym registration failed:", gymResult);
        toast.error(gymResult?.message || "Errore durante la registrazione della palestra");
        setRegistrationComplete(false);
        
        // Sign out the user if gym registration failed
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      toast.success("Registrazione completata con successo");
      
      // Navigate to the dashboard 
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Short delay to allow auth state to update
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Errore durante la registrazione");
      setRegistrationComplete(false);
      
      // Sign out the user if there was an error
      await supabase.auth.signOut();
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    step,
    registrationComplete,
    handleChange,
    handleSelectChange,
    nextStep,
    prevStep,
    handleSubmit
  };
};
