
import { supabase } from "@/integrations/supabase/client";
import { GymSettingsFormValues, TemplateSentBy } from "./types";

export async function fetchGymData(gymId: string) {
  const { data, error } = await supabase
    .from("gyms")
    .select("*")
    .eq("id", gymId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchGymSettingsData(gymId: string) {
  const { data, error } = await supabase
    .from("gym_settings")
    .select("*")
    .eq("gym_id", gymId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }
  return data;
}

export async function fetchUserGymId(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("gym_id")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.gym_id;
}

export async function updateGymData(gymId: string, gymData: Partial<GymSettingsFormValues>) {
  const { error } = await supabase
    .from("gyms")
    .update({ 
      name: gymData.name,
      address: gymData.address,
      city: gymData.city,
      postal_code: gymData.postal_code,
      country: gymData.country,
      phone: gymData.phone,
      email: gymData.email,
      website: gymData.website
    })
    .eq("id", gymId);

  if (error) throw error;
}

export async function updateGymSettings(
  gymId: string,
  settingsId: string | null,
  settingsData: Partial<GymSettingsFormValues>
) {
  // Determine template_sent_by based on sale_methods
  let templateSentBy: TemplateSentBy = "both";
  if (settingsData.sale_methods && settingsData.sale_methods.length === 1) {
    if (settingsData.sale_methods[0] === "package") {
      templateSentBy = "trainer";
    } else if (settingsData.sale_methods[0] === "custom") {
      templateSentBy = "system";
    }
  }

  const data = {
    gym_id: gymId,
    max_trials_per_client: settingsData.max_trials_per_client,
    enable_auto_followup: settingsData.enable_auto_followup,
    days_to_first_followup: settingsData.days_to_first_followup,
    days_to_active_confirmation: settingsData.days_to_active_confirmation,
    template_sent_by: templateSentBy,
    template_viewable_by_client: settingsData.template_viewable_by_client,
    allow_template_duplication: settingsData.allow_template_duplication,
    default_trainer_assignment_logic: settingsData.default_trainer_assignment_logic,
  };

  if (settingsId) {
    const { error } = await supabase
      .from("gym_settings")
      .update(data)
      .eq("id", settingsId);
    
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("gym_settings")
      .insert(data);
    
    if (error) throw error;
  }
}
