
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "@supabase/supabase-js";
import { GymSettingsFormValues, TemplateSentBy } from "./types";
import {
  fetchGymData,
  fetchGymSettingsData,
  fetchUserGymId,
  updateGymData,
  updateGymSettings
} from "./api";
import { toast } from "@/hooks/use-toast";

export function useGymSettingsForm() {
  const [gymId, setGymId] = useState<string | null>(null);
  const [gymSettingsId, setGymSettingsId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const form = useForm<GymSettingsFormValues>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postal_code: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      max_trials_per_client: 1,
      enable_auto_followup: true,
      days_to_first_followup: 7,
      days_to_active_confirmation: 30,
      template_sent_by: "both",
      template_viewable_by_client: true,
      allow_template_duplication: true,
      default_trainer_assignment_logic: "manual",
      sale_methods: ["both"],
    }
  });

  const fetchSettings = async (user: User | null) => {
    if (!user) {
      setFetchError("Utente non autenticato");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setFetchError(null);

    try {
      // Get the gym ID for the user
      const userGymId = await fetchUserGymId(user.id);
      if (!userGymId) {
        setFetchError("Non è stato possibile trovare la palestra associata all'utente");
        setIsLoading(false);
        return;
      }
      
      setGymId(userGymId);

      // Fetch gym data
      const gymData = await fetchGymData(userGymId);
      
      // Fetch gym settings data
      const gymSettingsData = await fetchGymSettingsData(userGymId);
      
      if (gymSettingsData) {
        setGymSettingsId(gymSettingsData.id);
      }

      // Determine sale methods based on template_sent_by
      let saleMethods: string[] = ["both"];
      if (gymSettingsData?.template_sent_by === "trainer") {
        saleMethods = ["package"];
      } else if (gymSettingsData?.template_sent_by === "system") {
        saleMethods = ["custom"];
      }

      // Update the form with the fetched data
      form.reset({
        name: gymData?.name || "",
        address: gymData?.address || "",
        city: gymData?.city || "",
        postal_code: gymData?.postal_code || "",
        country: gymData?.country || "",
        phone: gymData?.phone || "",
        email: gymData?.email || "",
        website: gymData?.website || "",
        max_trials_per_client: gymSettingsData?.max_trials_per_client || 1,
        enable_auto_followup: gymSettingsData?.enable_auto_followup ?? true,
        days_to_first_followup: gymSettingsData?.days_to_first_followup || 7,
        days_to_active_confirmation: gymSettingsData?.days_to_active_confirmation || 30,
        template_sent_by: normalizeTemplateSentBy(gymSettingsData?.template_sent_by),
        template_viewable_by_client: gymSettingsData?.template_viewable_by_client ?? true,
        allow_template_duplication: gymSettingsData?.allow_template_duplication ?? true,
        default_trainer_assignment_logic: gymSettingsData?.default_trainer_assignment_logic || "manual",
        sale_methods: saleMethods,
      });
    } catch (error) {
      console.error("Error fetching gym settings:", error);
      setFetchError("Si è verificato un errore durante il caricamento delle impostazioni");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (data: GymSettingsFormValues) => {
    if (!gymId) return;
    setSaveError(null);
    
    try {
      // Update gym data
      await updateGymData(gymId, data);
      
      // Update gym settings
      await updateGymSettings(gymId, gymSettingsId, data);
      
      toast({
        title: "Successo",
        description: "Le impostazioni della palestra sono state salvate",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving gym settings:", error);
      setSaveError("Si è verificato un errore durante il salvataggio delle impostazioni");
      
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio delle impostazioni",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const retryFetchSettings = (user: User | null) => {
    setRetryCount(prev => prev + 1);
    fetchSettings(user);
  };

  return {
    form,
    gymId,
    gymSettingsId,
    fetchSettings,
    saveSettings,
    fetchError,
    saveError,
    isLoading,
    retryFetchSettings
  };
}

// Helper function to normalize template_sent_by
function normalizeTemplateSentBy(value: string | null): TemplateSentBy {
  if (value === "trainer" || value === "system" || value === "both") {
    return value;
  }
  return "both";
}
