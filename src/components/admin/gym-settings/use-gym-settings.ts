
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type TemplateSentBy = "trainer" | "system" | "both";
type SaleMethod = "package" | "custom" | "both";

export type GymSettingsFormValues = {
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  max_trials_per_client: number;
  enable_auto_followup: boolean;
  days_to_first_followup: number;
  days_to_active_confirmation: number;
  template_sent_by: TemplateSentBy;
  template_viewable_by_client: boolean;
  allow_template_duplication: boolean;
  default_trainer_assignment_logic: string;
  sale_methods: string[];
};

export function useGymSettingsForm() {
  const [gymId, setGymId] = useState<string | null>(null);
  const [gymSettingsId, setGymSettingsId] = useState<string | null>(null);
  
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
    },
  });

  const fetchSettings = async (user: any) => {
    if (!user) return;

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("gym_id")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;
      if (userData?.gym_id) {
        setGymId(userData.gym_id);
      } else {
        return;
      }

      const { data: gymData, error: gymError } = await supabase
        .from("gyms")
        .select("*")
        .eq("id", userData.gym_id)
        .single();

      if (gymError) throw gymError;

      const { data: settingsData, error: settingsError } = await supabase
        .from("gym_settings")
        .select("*")
        .eq("gym_id", userData.gym_id)
        .single();

      if (settingsError && settingsError.code !== "PGRST116") {
        throw settingsError;
      }

      const normalizeTemplateSentBy = (value: string | null): TemplateSentBy => {
        if (value === "trainer" || value === "system" || value === "both") {
          return value;
        }
        return "both";
      };

      // Determine sale methods from template_sent_by
      let saleMethods: string[] = ["both"];
      if (settingsData?.template_sent_by === "package") {
        saleMethods = ["package"];
      } else if (settingsData?.template_sent_by === "custom") {
        saleMethods = ["custom"];
      }

      form.reset({
        name: gymData?.name || "",
        address: gymData?.address || "",
        city: gymData?.city || "",
        postal_code: gymData?.postal_code || "",
        country: gymData?.country || "",
        phone: gymData?.phone || "",
        email: gymData?.email || "",
        website: gymData?.website || "",
        max_trials_per_client: settingsData?.max_trials_per_client || 1,
        enable_auto_followup: settingsData?.enable_auto_followup || true,
        days_to_first_followup: settingsData?.days_to_first_followup || 7,
        days_to_active_confirmation: settingsData?.days_to_active_confirmation || 30,
        template_sent_by: normalizeTemplateSentBy(settingsData?.template_sent_by),
        template_viewable_by_client: settingsData?.template_viewable_by_client || true,
        allow_template_duplication: settingsData?.allow_template_duplication || true,
        default_trainer_assignment_logic: settingsData?.default_trainer_assignment_logic || "manual",
        sale_methods: saleMethods,
      });

      if (settingsData) {
        setGymSettingsId(settingsData.id);
      }
    } catch (error) {
      console.error("Error fetching gym settings:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile recuperare le impostazioni della palestra",
        variant: "destructive",
      });
    }
  };

  const saveSettings = async (data: GymSettingsFormValues) => {
    if (!gymId) {
      toast({
        title: "Errore",
        description: "ID palestra non disponibile",
        variant: "destructive",
      });
      return;
    }

    try {
      // Determine template_sent_by based on sale_methods
      let templateSentBy: TemplateSentBy = "both";
      if (data.sale_methods.length === 1) {
        if (data.sale_methods[0] === "package") {
          templateSentBy = "trainer";
        } else if (data.sale_methods[0] === "custom") {
          templateSentBy = "system";
        }
      }

      // Update gym data
      const { error: gymError } = await supabase
        .from("gyms")
        .update({ 
          name: data.name,
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
          country: data.country,
          phone: data.phone,
          email: data.email,
          website: data.website
        })
        .eq("id", gymId);

      if (gymError) throw gymError;

      const settingsData = {
        gym_id: gymId,
        max_trials_per_client: data.max_trials_per_client,
        enable_auto_followup: data.enable_auto_followup,
        days_to_first_followup: data.days_to_first_followup,
        days_to_active_confirmation: data.days_to_active_confirmation,
        template_sent_by: templateSentBy,
        template_viewable_by_client: data.template_viewable_by_client,
        allow_template_duplication: data.allow_template_duplication,
        default_trainer_assignment_logic: data.default_trainer_assignment_logic,
      };

      let settingsError;
      if (gymSettingsId) {
        const { error } = await supabase
          .from("gym_settings")
          .update(settingsData)
          .eq("id", gymSettingsId);
        
        settingsError = error;
      } else {
        const { error } = await supabase
          .from("gym_settings")
          .insert(settingsData);
        
        settingsError = error;
      }

      if (settingsError) throw settingsError;
    } catch (error) {
      throw error;
    }
  };

  return { form, gymId, gymSettingsId, fetchSettings, saveSettings };
}
