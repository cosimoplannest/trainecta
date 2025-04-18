
import { supabase } from "@/integrations/supabase/client";
import { InsuranceFile } from "../types";

export const fetchTrainerInsurance = async (trainerId: string): Promise<InsuranceFile | null> => {
  try {
    const { data, error } = await supabase
      .from("trainer_insurance")
      .select("*")
      .eq("trainer_id", trainerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no data found, return null instead of throwing error
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as InsuranceFile;
  } catch (error) {
    console.error("Error fetching trainer insurance:", error);
    return null;
  }
};

export const createTrainerInsurance = async (
  insuranceData: Partial<InsuranceFile>,
  file?: File
): Promise<InsuranceFile | null> => {
  try {
    let fileUrl = null;

    // Upload file if provided
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${insuranceData.trainer_id}/insurance-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("trainer_documents")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from("trainer_documents")
        .getPublicUrl(fileName);
      
      fileUrl = urlData.publicUrl;
    }

    // Ensure all required fields are present
    if (!insuranceData.trainer_id || !insuranceData.gym_id || !insuranceData.start_date || !insuranceData.end_date) {
      throw new Error("Missing required fields for insurance creation");
    }

    // Create insurance entry
    const { data, error } = await supabase
      .from("trainer_insurance")
      .insert({
        trainer_id: insuranceData.trainer_id,
        gym_id: insuranceData.gym_id,
        policy_number: insuranceData.policy_number,
        start_date: insuranceData.start_date,
        end_date: insuranceData.end_date,
        notes: insuranceData.notes,
        file_url: fileUrl
      })
      .select()
      .single();

    if (error) throw error;
    
    return data as InsuranceFile;
  } catch (error) {
    console.error("Error creating trainer insurance:", error);
    return null;
  }
};

export const updateTrainerInsurance = async (
  id: string,
  insuranceData: Partial<InsuranceFile>,
  file?: File
): Promise<InsuranceFile | null> => {
  try {
    let fileUrl = insuranceData.file_url;

    // Upload new file if provided
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${insuranceData.trainer_id}/insurance-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("trainer_documents")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from("trainer_documents")
        .getPublicUrl(fileName);
      
      fileUrl = urlData.publicUrl;
    }

    // Ensure we have data to update
    if (!insuranceData.trainer_id || !insuranceData.gym_id || !insuranceData.start_date || !insuranceData.end_date) {
      throw new Error("Missing required fields for insurance update");
    }

    // Update insurance entry
    const { data, error } = await supabase
      .from("trainer_insurance")
      .update({
        trainer_id: insuranceData.trainer_id,
        gym_id: insuranceData.gym_id,
        policy_number: insuranceData.policy_number,
        start_date: insuranceData.start_date,
        end_date: insuranceData.end_date,
        notes: insuranceData.notes,
        file_url: fileUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    return data as InsuranceFile;
  } catch (error) {
    console.error("Error updating trainer insurance:", error);
    return null;
  }
};
