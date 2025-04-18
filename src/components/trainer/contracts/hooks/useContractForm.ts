
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { createTrainerContract, updateTrainerContract } from "../api";
import { ContractFile } from "../types";

interface ContractFormValues {
  contract_type: 'collaboration' | 'vat_fixed_fee' | 'vat_percentage';
  start_date: Date;
  end_date?: Date | null;
  monthly_fee?: number | null;
  percentage?: number | null;
  notes?: string;
}

interface UseContractFormProps {
  trainerId: string;
  gymId?: string;
  contract: ContractFile | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const useContractForm = ({
  trainerId,
  gymId,
  contract,
  onSuccess,
  onClose
}: UseContractFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<ContractFormValues>({
    defaultValues: contract ? {
      contract_type: contract.contract_type,
      start_date: contract.start_date ? new Date(contract.start_date) : new Date(),
      end_date: contract.end_date ? new Date(contract.end_date) : null,
      monthly_fee: contract.monthly_fee || null,
      percentage: contract.percentage || null,
      notes: contract.notes || ""
    } : {
      contract_type: 'collaboration',
      start_date: new Date(),
      end_date: null,
      monthly_fee: null,
      percentage: null,
      notes: ""
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (values: ContractFormValues) => {
    if (!gymId) {
      toast({
        title: "Errore",
        description: "ID della palestra mancante",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const contractData = {
        trainer_id: trainerId,
        gym_id: gymId,
        contract_type: values.contract_type,
        start_date: values.start_date.toISOString().split('T')[0],
        end_date: values.end_date ? values.end_date.toISOString().split('T')[0] : null,
        monthly_fee: values.contract_type !== 'vat_percentage' ? values.monthly_fee : null,
        percentage: values.contract_type === 'vat_percentage' ? values.percentage : null,
        notes: values.notes,
        file_url: contract?.file_url
      };

      let result;
      if (contract) {
        result = await updateTrainerContract(contract.id, contractData, file || undefined);
      } else {
        result = await createTrainerContract(contractData, file || undefined);
      }

      if (result) {
        toast({
          title: "Successo",
          description: contract 
            ? "Contratto aggiornato con successo" 
            : "Contratto creato con successo",
        });
        onSuccess();
        onClose();
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      console.error("Error submitting contract form:", error);
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
};
