
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
      // Register the user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      });

      if (authError) {
        toast.error(authError.message || "Errore durante la registrazione");
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Show registration in progress message
        setRegistrationComplete(true);
        
        // Create a new gym with more robust error handling
        const { data: gymData, error: gymError } = await supabase
          .from('gyms')
          .insert({
            name: formData.gymName,
            address: formData.address,
            phone: formData.phone,
            website: formData.socialLink,
            email: formData.email
          })
          .select('id')
          .single();

        if (gymError) {
          // If gym creation fails, we want to handle this gracefully
          toast.error("Errore nella creazione della palestra. Riprova più tardi.");
          
          // Optional: You might want to delete the user if gym creation fails
          await supabase.auth.signOut();
          
          setIsLoading(false);
          setRegistrationComplete(false);
          return;
        }

        // Update the user record with gym_id and role = 'admin'
        const { error: userError } = await supabase
          .from('users')
          .update({
            gym_id: gymData.id,
            role: 'admin'
          })
          .eq('id', authData.user.id);

        if (userError) {
          toast.error("Errore nell'aggiornamento del profilo utente");
          setIsLoading(false);
          setRegistrationComplete(false);
          return;
        }

        // Create initial gym settings
        const { error: settingsError } = await supabase
          .from('gym_settings')
          .insert({
            gym_id: gymData.id,
            max_trials_per_client: 1,
            enable_auto_followup: true,
            days_to_first_followup: 7,
            days_to_active_confirmation: 30,
            template_sent_by: 'both',
            template_viewable_by_client: true,
            allow_template_duplication: true,
            default_trainer_assignment_logic: 'manual'
          });

        if (settingsError) {
          toast.error("Errore nell'impostazione delle configurazioni della palestra");
          setIsLoading(false);
          setRegistrationComplete(false);
          return;
        }

        toast.success("Registrazione completata con successo");
        // Navigate directly to the admin dashboard
        navigate("/dashboard/admin");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Errore durante la registrazione");
      setRegistrationComplete(false);
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
