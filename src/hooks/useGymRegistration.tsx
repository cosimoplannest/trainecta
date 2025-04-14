
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

  // Create gym and return the gym ID
  const createGym = async () => {
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
      throw new Error(`Errore nella creazione della palestra: ${gymError.message}`);
    }

    return gymData.id;
  };

  // Create default gym settings
  const createGymSettings = async (gymId: string) => {
    const { error: settingsError } = await supabase
      .from('gym_settings')
      .insert({
        gym_id: gymId,
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
      throw new Error(`Errore nell'impostazione delle configurazioni: ${settingsError.message}`);
    }
  };

  // Update user record with gym_id and admin role
  const assignUserToGym = async (userId: string, gymId: string) => {
    const { error: userError } = await supabase
      .from('users')
      .update({
        gym_id: gymId,
        role: 'admin'
      })
      .eq('id', userId);

    if (userError) {
      throw new Error(`Errore nell'aggiornamento del profilo utente: ${userError.message}`);
    }
  };

  // Clean up in case of errors
  const cleanUpOnError = async (userId?: string, gymId?: string) => {
    // Delete gym if it was created
    if (gymId) {
      await supabase
        .from('gyms')
        .delete()
        .eq('id', gymId);
    }

    // Sign out the user if they were signed up
    if (userId) {
      await supabase.auth.signOut();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    let userId = null;
    let gymId = null;
    
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

      userId = authData.user?.id;

      if (!userId) {
        toast.error("Errore: Impossibile creare l'utente");
        setIsLoading(false);
        return;
      }

      // Show registration in progress
      setRegistrationComplete(true);
      
      // Step 2: Create the gym
      gymId = await createGym();
      
      // Step 3: Update the user with gym_id and admin role
      await assignUserToGym(userId, gymId);
      
      // Step 4: Create default gym settings
      await createGymSettings(gymId);

      toast.success("Registrazione completata con successo");
      
      // Navigate to the dashboard 
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Short delay to allow auth state to update
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Errore durante la registrazione");
      setRegistrationComplete(false);
      
      // Attempt to clean up partial registrations
      await cleanUpOnError(userId, gymId);
      
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
