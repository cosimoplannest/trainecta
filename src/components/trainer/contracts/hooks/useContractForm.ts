
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ContractFile } from "../types";
import { upsertTrainerContract } from "../api";
import { format } from "date-fns";

interface UseContractFormProps {
  trainerId: string;
  gymId: string;
  contract?: ContractFile | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function useContractForm({ trainerId, gymId, contract, onSuccess, onClose }: UseContractFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      contract_type: "collaboration" as 'collaboration' | 'vat_fixed_fee' | 'vat_percentage',
      start_date: new Date(),
      end_date: null as Date | null,
      monthly_fee: "" as unknown as number,
      percentage: "" as unknown as number,
      notes: "",
    }
  });

  useEffect(() => {
    if (contract) {
      form.reset({
        contract_type: contract.contract_type,
        start_date: contract.start_date ? new Date(contract.start_date) : new Date(),
        end_date: contract.end_date ? new Date(contract.end_date) : null,
        monthly_fee: contract.monthly_fee || undefined,
        percentage: contract.percentage || undefined,
        notes: contract.notes || "",
      });
    } else {
      form.reset({
        contract_type: "collaboration",
        start_date: new Date(),
        end_date: null,
        monthly_fee: undefined,
        percentage: undefined,
        notes: "",
      });
      setFile(null);
    }
  }, [contract, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const contractData: Partial<ContractFile> = {
        trainer_id: trainerId,
        gym_id: gymId,
        contract_type: data.contract_type,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
        monthly_fee: data.monthly_fee || null,
        percentage: data.percentage || null,
        notes: data.notes || null,
      };

      if (contract?.id) {
        contractData.id = contract.id;
        contractData.file_url = contract.file_url;
      }

      await upsertTrainerContract(contractData, file || undefined);
      
      toast({
        title: "Contratto salvato",
        description: "Il contratto è stato salvato con successo",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving contract:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del contratto",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleFileChange,
    onSubmit,
    file
  };
}
