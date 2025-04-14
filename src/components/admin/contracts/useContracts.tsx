
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContractFormData } from "./ContractDialog";
import { Contract } from "./ContractList";

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState<ContractFormData>({
    name: "",
    description: "",
    type: "subscription",
    price: "",
    duration: "30",
    status: "active"
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i contratti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "subscription",
      price: "",
      duration: "30",
      status: "active"
    });
    setIsEditing(false);
    setCurrentContract(null);
  };

  const openEditDialog = (contract: Contract) => {
    setCurrentContract(contract);
    
    // Map duration_days back to the form value
    const durationValue = contract.duration_days.toString();
    
    setFormData({
      name: contract.name || "",
      description: contract.description || "",
      type: "subscription", // Default type for existing contracts
      price: contract.price?.toString() || "",
      duration: durationValue,
      status: contract.is_active ? "active" : "inactive"
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = async (formData: ContractFormData) => {
    try {
      // Map form data to table structure
      const durationDays = parseInt(formData.duration) || 30;
      
      // Create an object that matches the subscriptions table schema
      const dataToSubmit = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        duration_days: durationDays,
        is_active: formData.status === "active",
        gym_id: "11111111-1111-1111-1111-111111111111", // Example hardcoded ID
      };

      if (isEditing && currentContract) {
        const { error } = await supabase
          .from("subscriptions")
          .update(dataToSubmit)
          .eq("id", currentContract.id);

        if (error) throw error;
        toast({
          title: "Contratto aggiornato",
          description: "Il contratto è stato aggiornato con successo",
        });
      } else {
        const { error } = await supabase
          .from("subscriptions")
          .insert(dataToSubmit);

        if (error) throw error;
        toast({
          title: "Contratto creato",
          description: "Il contratto è stato creato con successo",
        });
      }

      fetchContracts();
    } catch (error) {
      console.error("Error saving contract:", error);
      throw error;
    }
  };

  const handleDeleteContract = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo contratto?")) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Contratto eliminato",
        description: "Il contratto è stato eliminato con successo",
      });
      
      fetchContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il contratto",
        variant: "destructive",
      });
    }
  };

  return {
    contracts,
    loading,
    dialogOpen,
    setDialogOpen,
    isEditing,
    formData,
    resetForm,
    openEditDialog,
    handleSubmit,
    handleDeleteContract
  };
}
