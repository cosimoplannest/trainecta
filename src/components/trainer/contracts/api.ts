
import { supabase } from "@/integrations/supabase/client";
import { ContractFile, InsuranceFile } from "./types";

/**
 * Fetches trainer contract
 */
export async function fetchTrainerContract(trainerId: string): Promise<ContractFile | null> {
  const { data, error } = await supabase
    .from("trainer_contracts")
    .select("*")
    .eq("trainer_id", trainerId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching trainer contract:", error);
    throw error;
  }

  return data as ContractFile | null;
}

/**
 * Creates or updates a trainer contract
 */
export async function upsertTrainerContract(
  contract: Partial<ContractFile>,
  file?: File
): Promise<ContractFile> {
  let fileUrl = contract.file_url;

  // Upload file if provided
  if (file) {
    const fileName = `${contract.trainer_id}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("trainer_contracts")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading contract file:", uploadError);
      throw uploadError;
    }

    // Get public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from("trainer_contracts")
      .getPublicUrl(fileName);

    fileUrl = publicUrl;
  }

  // Make sure all required fields are present for an upsert
  const contractData: Partial<ContractFile> = {
    ...contract,
    file_url: fileUrl,
    updated_at: new Date().toISOString()
  };

  // Ensure trainer_id, gym_id, contract_type, and start_date are defined
  if (!contractData.trainer_id || !contractData.gym_id || !contractData.contract_type || !contractData.start_date) {
    throw new Error("Missing required contract fields");
  }

  // Now save the contract record with the file URL
  const { data, error } = await supabase
    .from("trainer_contracts")
    .upsert(contractData as any)
    .select()
    .single();

  if (error) {
    console.error("Error saving trainer contract:", error);
    throw error;
  }

  return data as ContractFile;
}

/**
 * Deletes a trainer contract
 */
export async function deleteTrainerContract(contractId: string): Promise<void> {
  // First get the contract to get the file URL
  const { data: contract, error: fetchError } = await supabase
    .from("trainer_contracts")
    .select("file_url")
    .eq("id", contractId)
    .single();

  if (fetchError) {
    console.error("Error fetching contract to delete:", fetchError);
    throw fetchError;
  }

  // Delete the associated file if it exists
  if (contract?.file_url) {
    const filePath = contract.file_url.split("/").slice(-2).join("/");
    const { error: storageError } = await supabase
      .storage
      .from("trainer_contracts")
      .remove([filePath]);

    if (storageError) {
      console.error("Error deleting contract file:", storageError);
      // Continue with record deletion even if file deletion fails
    }
  }

  // Delete the contract record
  const { error } = await supabase
    .from("trainer_contracts")
    .delete()
    .eq("id", contractId);

  if (error) {
    console.error("Error deleting trainer contract:", error);
    throw error;
  }
}

/**
 * Fetches trainer insurance
 */
export async function fetchTrainerInsurance(trainerId: string): Promise<InsuranceFile | null> {
  const { data, error } = await supabase
    .from("trainer_insurance")
    .select("*")
    .eq("trainer_id", trainerId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching trainer insurance:", error);
    throw error;
  }

  return data as InsuranceFile | null;
}

/**
 * Creates or updates a trainer insurance
 */
export async function upsertTrainerInsurance(
  insurance: Partial<InsuranceFile>,
  file?: File
): Promise<InsuranceFile> {
  let fileUrl = insurance.file_url;

  // Upload file if provided
  if (file) {
    const fileName = `${insurance.trainer_id}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("trainer_insurance")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading insurance file:", uploadError);
      throw uploadError;
    }

    // Get public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from("trainer_insurance")
      .getPublicUrl(fileName);

    fileUrl = publicUrl;
  }

  // Make sure all required fields are present for an upsert
  const insuranceData: Partial<InsuranceFile> = {
    ...insurance,
    file_url: fileUrl,
    updated_at: new Date().toISOString()
  };

  // Ensure trainer_id, gym_id, start_date, end_date are defined
  if (!insuranceData.trainer_id || !insuranceData.gym_id || !insuranceData.start_date || !insuranceData.end_date) {
    throw new Error("Missing required insurance fields");
  }

  // Now save the insurance record with the file URL
  const { data, error } = await supabase
    .from("trainer_insurance")
    .upsert(insuranceData as any)
    .select()
    .single();

  if (error) {
    console.error("Error saving trainer insurance:", error);
    throw error;
  }

  return data as InsuranceFile;
}

/**
 * Deletes a trainer insurance
 */
export async function deleteTrainerInsurance(insuranceId: string): Promise<void> {
  // First get the insurance to get the file URL
  const { data: insurance, error: fetchError } = await supabase
    .from("trainer_insurance")
    .select("file_url")
    .eq("id", insuranceId)
    .single();

  if (fetchError) {
    console.error("Error fetching insurance to delete:", fetchError);
    throw fetchError;
  }

  // Delete the associated file if it exists
  if (insurance?.file_url) {
    const filePath = insurance.file_url.split("/").slice(-2).join("/");
    const { error: storageError } = await supabase
      .storage
      .from("trainer_insurance")
      .remove([filePath]);

    if (storageError) {
      console.error("Error deleting insurance file:", storageError);
      // Continue with record deletion even if file deletion fails
    }
  }

  // Delete the insurance record
  const { error } = await supabase
    .from("trainer_insurance")
    .delete()
    .eq("id", insuranceId);

  if (error) {
    console.error("Error deleting trainer insurance:", error);
    throw error;
  }
}
