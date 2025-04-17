
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchTrainerContract, fetchTrainerInsurance } from "./api";
import { TrainerContractDialog } from "./TrainerContractDialog";
import { TrainerInsuranceDialog } from "./TrainerInsuranceDialog";
import { ContractFile, InsuranceFile } from "./types";
import { useAuth } from "@/hooks/use-auth";
import { ContractCard } from "./cards/ContractCard";
import { InsuranceCard } from "./cards/InsuranceCard";

interface TrainerDocumentsProps {
  trainerId: string;
  trainerName: string;
}

export function TrainerDocuments({ trainerId }: TrainerDocumentsProps) {
  const [contract, setContract] = useState<ContractFile | null>(null);
  const [insurance, setInsurance] = useState<InsuranceFile | null>(null);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [insuranceDialogOpen, setInsuranceDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isAdmin = user?.user_metadata?.role === 'admin';
  const isTrainer = user?.id === trainerId;

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const [contractData, insuranceData] = await Promise.all([
        fetchTrainerContract(trainerId),
        fetchTrainerInsurance(trainerId)
      ]);
      
      setContract(contractData);
      setInsurance(insuranceData);
    } catch (error) {
      console.error("Error fetching trainer documents:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i documenti del trainer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trainerId) {
      fetchDocuments();
    }
  }, [trainerId]);

  return (
    <div className="space-y-6">
      <ContractCard
        contract={contract}
        loading={loading}
        isAdmin={isAdmin}
        onEdit={() => setContractDialogOpen(true)}
      />
      
      <InsuranceCard
        insurance={insurance}
        loading={loading}
        isTrainer={isTrainer}
        onEdit={() => setInsuranceDialogOpen(true)}
      />
      
      <TrainerContractDialog
        open={contractDialogOpen}
        onOpenChange={setContractDialogOpen}
        trainerId={trainerId}
        contract={contract}
        onSuccess={fetchDocuments}
        isAdmin={isAdmin}
      />
      
      <TrainerInsuranceDialog
        open={insuranceDialogOpen}
        onOpenChange={setInsuranceDialogOpen}
        trainerId={trainerId}
        insurance={insurance}
        onSuccess={fetchDocuments}
      />
    </div>
  );
}
