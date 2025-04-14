
import { supabase } from "@/integrations/supabase/client";
import { GymSettingsFormValues, TemplateSentBy } from "./types";

// Maximum number of retry attempts for API calls
const MAX_RETRIES = 3;

// Helper function to execute API calls with retry logic
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Wait before retrying (exponential backoff)
    const delay = Math.pow(2, MAX_RETRIES - retries) * 500;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    console.log(`Retrying operation, ${retries} attempts left...`);
    return executeWithRetry(operation, retries - 1);
  }
}

export async function fetchUserGymId(userId: string) {
  return executeWithRetry(async () => {
    const { data, error } = await supabase
      .from("users")
      .select("gym_id")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user gym ID:", error);
      throw error;
    }
    
    if (!data?.gym_id) {
      throw new Error("User does not have an associated gym");
    }
    
    return data.gym_id;
  });
}

export async function fetchGymData(gymId: string) {
  return executeWithRetry(async () => {
    const { data, error } = await supabase
      .from("gyms")
      .select("*")
      .eq("id", gymId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching gym data:", error);
      throw error;
    }
    
    return data;
  });
}

export async function fetchGymSettingsData(gymId: string) {
  return executeWithRetry(async () => {
    const { data, error } = await supabase
      .from("gym_settings")
      .select("*")
      .eq("gym_id", gymId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching gym settings data:", error);
      throw error;
    }
    
    return data;
  });
}

export async function updateGymData(gymId: string, gymData: Partial<GymSettingsFormValues>) {
  return executeWithRetry(async () => {
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

    if (error) {
      console.error("Error updating gym data:", error);
      throw error;
    }
  });
}

export async function updateGymSettings(
  gymId: string,
  settingsId: string | null,
  settingsData: Partial<GymSettingsFormValues>
) {
  return executeWithRetry(async () => {
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

    // Check if settings exist and update or insert accordingly
    if (settingsId) {
      const { error } = await supabase
        .from("gym_settings")
        .update(data)
        .eq("id", settingsId);
      
      if (error) {
        console.error("Error updating gym settings:", error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from("gym_settings")
        .insert(data);
      
      if (error) {
        console.error("Error inserting gym settings:", error);
        throw error;
      }
    }
  });
}
