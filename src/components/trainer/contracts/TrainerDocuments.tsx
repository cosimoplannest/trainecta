
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Shield, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isAfter, parseISO } from "date-fns";
import { fetchTrainerContract, fetchTrainerInsurance } from "./api";
import { TrainerContractDialog } from "./TrainerContractDialog";
import { TrainerInsuranceDialog } from "./TrainerInsuranceDialog";
import { ContractFile, InsuranceFile } from "./types";
import { useAuth } from "@/hooks/use-auth";

interface TrainerDocumentsProps {
  trainerId: string;
  trainerName: string;
}

export function TrainerDocuments({ trainerId, trainerName }: TrainerDocumentsProps) {
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

  const isInsuranceExpired = insurance?.end_date 
    ? isAfter(new Date(), parseISO(insurance.end_date)) 
    : false;

  const isContractExpired = contract?.end_date 
    ? isAfter(new Date(), parseISO(contract.end_date)) 
    : false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contratto di Lavoro
          </CardTitle>
          
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setContractDialogOpen(true)}
            >
              {contract ? (
                <>Modifica Contratto</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Aggiungi Contratto
                </>
              )}
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : contract ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Tipo Contratto</p>
                  <p className="text-sm">
                    {contract.contract_type === 'collaboration' ? 'Collaborazione' : 
                     contract.contract_type === 'vat_fixed_fee' ? 'Partita IVA (Compenso Fisso)' : 
                     'Partita IVA (Percentuale)'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Stato</p>
                  <div className="flex items-center gap-1 mt-1">
                    {isContractExpired ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-500">Scaduto</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Attivo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Data Inizio</p>
                  <p className="text-sm">
                    {contract.start_date ? format(new Date(contract.start_date), 'dd/MM/yyyy') : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Data Fine</p>
                  <p className="text-sm">
                    {contract.end_date ? format(new Date(contract.end_date), 'dd/MM/yyyy') : 'Contratto a tempo indeterminato'}
                  </p>
                </div>
              </div>
              
              {(contract.monthly_fee || contract.percentage) && (
                <div className="grid grid-cols-2 gap-4">
                  {contract.monthly_fee !== null && (
                    <div>
                      <p className="text-sm font-medium">Compenso Mensile</p>
                      <p className="text-sm">€{contract.monthly_fee.toFixed(2)}</p>
                    </div>
                  )}
                  
                  {contract.percentage !== null && (
                    <div>
                      <p className="text-sm font-medium">Percentuale</p>
                      <p className="text-sm">{contract.percentage}%</p>
                    </div>
                  )}
                </div>
              )}
              
              {contract.notes && (
                <div>
                  <p className="text-sm font-medium">Note</p>
                  <p className="text-sm text-muted-foreground">{contract.notes}</p>
                </div>
              )}
              
              {contract.file_url && (
                <div>
                  <a
                    href={contract.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Visualizza contratto
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {isAdmin 
                  ? "Nessun contratto registrato. Clicca su 'Aggiungi Contratto' per inserirne uno."
                  : "Nessun contratto registrato. Contatta l'amministratore per maggiori informazioni."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Polizza Assicurativa
          </CardTitle>
          
          {isTrainer && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInsuranceDialogOpen(true)}
            >
              {insurance ? (
                <>Modifica Polizza</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Aggiungi Polizza
                </>
              )}
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : insurance ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {insurance.policy_number && (
                  <div>
                    <p className="text-sm font-medium">Numero Polizza</p>
                    <p className="text-sm">{insurance.policy_number}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium">Stato</p>
                  <div className="flex items-center gap-1 mt-1">
                    {isInsuranceExpired ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-500">Scaduta</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Attiva</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Data Inizio</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {insurance.start_date ? format(new Date(insurance.start_date), 'dd/MM/yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Data Scadenza</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {insurance.end_date ? format(new Date(insurance.end_date), 'dd/MM/yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {insurance.notes && (
                <div>
                  <p className="text-sm font-medium">Note</p>
                  <p className="text-sm text-muted-foreground">{insurance.notes}</p>
                </div>
              )}
              
              {insurance.file_url && (
                <div>
                  <a
                    href={insurance.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Visualizza polizza
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {isTrainer 
                  ? "Nessuna polizza assicurativa registrata. Clicca su 'Aggiungi Polizza' per inserirne una."
                  : "Nessuna polizza assicurativa registrata per questo trainer."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
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
