import { supabase } from "@/integrations/supabase/client";
import { ContractFormData, Contract } from "./types";

/**
 * Fetches all contracts from the database
 */
export async function fetchContracts(): Promise<Contract[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Creates a new contract in the database
 */
export async function createContract(formData: ContractFormData): Promise<void> {
  const durationDays = parseInt(formData.duration) || 30;
  
  const dataToSubmit = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: parseFloat(formData.price) || 0,
    duration_days: durationDays,
    is_active: formData.status === "active",
    gym_id: "11111111-1111-1111-1111-111111111111",
  };

  const { error } = await supabase
    .from("subscriptions")
    .insert(dataToSubmit);

  if (error) throw error;
}

/**
 * Updates an existing contract in the database
 */
export async function updateContract(contractId: string, formData: ContractFormData): Promise<void> {
  const durationDays = parseInt(formData.duration) || 30;
  
  const dataToSubmit = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: parseFloat(formData.price) || 0,
    duration_days: durationDays,
    is_active: formData.status === "active",
  };

  const { error } = await supabase
    .from("subscriptions")
    .update(dataToSubmit)
    .eq("id", contractId);

  if (error) throw error;
}

/**
 * Deletes a contract from the database
 */
export async function deleteContract(contractId: string): Promise<void> {
  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", contractId);

  if (error) throw error;
}
