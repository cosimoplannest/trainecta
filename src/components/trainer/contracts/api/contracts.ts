
import { supabase } from "@/integrations/supabase/client";
import { ContractFile } from "../types";

export const fetchTrainerContract = async (trainerId: string): Promise<ContractFile | null> => {
  try {
    const { data, error } = await supabase
      .from("trainer_contracts")
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

    return data as ContractFile;
  } catch (error) {
    console.error("Error fetching trainer contract:", error);
    return null;
  }
};

export const createTrainerContract = async (
  contractData: Partial<ContractFile>,
  file?: File
): Promise<ContractFile | null> => {
  try {
    let fileUrl = null;

    // Upload file if provided
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${contractData.trainer_id}/contract-${Date.now()}.${fileExt}`;
      
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

    // Create contract entry
    const { data, error } = await supabase
      .from("trainer_contracts")
      .insert([
        {
          ...contractData,
          file_url: fileUrl
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    return data as ContractFile;
  } catch (error) {
    console.error("Error creating trainer contract:", error);
    return null;
  }
};

export const updateTrainerContract = async (
  id: string,
  contractData: Partial<ContractFile>,
  file?: File
): Promise<ContractFile | null> => {
  try {
    let fileUrl = contractData.file_url;

    // Upload new file if provided
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${contractData.trainer_id}/contract-${Date.now()}.${fileExt}`;
      
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

    // Update contract entry
    const { data, error } = await supabase
      .from("trainer_contracts")
      .update({
        ...contractData,
        file_url: fileUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    return data as ContractFile;
  } catch (error) {
    console.error("Error updating trainer contract:", error);
    return null;
  }
};
