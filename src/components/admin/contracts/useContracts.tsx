
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ContractFormData } from "./ContractDialog";
import { Contract } from "./ContractList";
import * as contractsApi from "./api";

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

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contractsApi.fetchContracts();
      setContracts(data);
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
  }, [toast]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const resetForm = useCallback(() => {
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
  }, []);

  const openEditDialog = useCallback((contract: Contract) => {
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
  }, []);

  const handleSubmit = useCallback(async (formData: ContractFormData) => {
    try {
      if (isEditing && currentContract) {
        await contractsApi.updateContract(currentContract.id, formData);
        toast({
          title: "Contratto aggiornato",
          description: "Il contratto è stato aggiornato con successo",
        });
      } else {
        await contractsApi.createContract(formData);
        toast({
          title: "Contratto creato",
          description: "Il contratto è stato creato con successo",
        });
      }

      fetchContracts();
    } catch (error) {
      console.error("Error saving contract:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il contratto",
        variant: "destructive",
      });
    }
  }, [isEditing, currentContract, toast, fetchContracts]);

  const handleDeleteContract = useCallback(async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo contratto?")) return;

    try {
      await contractsApi.deleteContract(id);
      
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
  }, [toast, fetchContracts]);

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
