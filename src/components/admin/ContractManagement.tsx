
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  FileText, 
  Upload, 
  Download, 
  Plus, 
  Calendar, 
  Pencil, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Shield
} from "lucide-react";

// Contract types from the database enum
type ContractType = 'collaboration' | 'vat_fixed_fee' | 'vat_percentage';

// Contract form values
type ContractFormValues = {
  trainer_id: string;
  contract_type: ContractType;
  start_date: string;
  end_date?: string;
  monthly_fee?: number;
  percentage?: number;
  notes?: string;
  file?: FileList;
};

// Insurance form values
type InsuranceFormValues = {
  trainer_id: string;
  policy_number?: string;
  start_date: string;
  end_date: string;
  notes?: string;
  file?: FileList;
};

type Trainer = {
  id: string;
  full_name: string;
  email: string;
};

type Contract = {
  id: string;
  trainer_id: string;
  trainer_name?: string;
  contract_type: ContractType;
  start_date: string;
  end_date: string | null;
  monthly_fee: number | null;
  percentage: number | null;
  notes: string | null;
  file_url: string | null;
  created_at: string;
};

type Insurance = {
  id: string;
  trainer_id: string;
  trainer_name?: string;
  policy_number: string | null;
  start_date: string;
  end_date: string;
  notes: string | null;
  file_url: string | null;
  created_at: string;
};

export function ContractManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [gymId, setGymId] = useState<string | null>(null);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [insuranceDialogOpen, setInsuranceDialogOpen] = useState(false);
  const [editContract, setEditContract] = useState<Contract | null>(null);
  const [editInsurance, setEditInsurance] = useState<Insurance | null>(null);
  const [uploadingContract, setUploadingContract] = useState(false);
  const [uploadingInsurance, setUploadingInsurance] = useState(false);
  
  const contractForm = useForm<ContractFormValues>({
    defaultValues: {
      trainer_id: "",
      contract_type: "collaboration",
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: "",
      monthly_fee: undefined,
      percentage: undefined,
      notes: "",
    },
  });

  const insuranceForm = useForm<InsuranceFormValues>({
    defaultValues: {
      trainer_id: "",
      policy_number: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
      notes: "",
    },
  });

  // Get the gym ID and load trainers
  useEffect(() => {
    const fetchGymIdAndTrainers = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get user's gym ID
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("gym_id")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;
        if (!userData?.gym_id) throw new Error("Gym ID not found");
        
        setGymId(userData.gym_id);
        
        // Get trainers from the gym
        const { data: trainersData, error: trainersError } = await supabase
          .from("users")
          .select("id, full_name, email")
          .eq("gym_id", userData.gym_id)
          .eq("role", "trainer");
        
        if (trainersError) throw trainersError;
        setTrainers(trainersData || []);
        
        // Load existing contracts and insurances
        await loadContracts(userData.gym_id);
        await loadInsurances(userData.gym_id);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare i dati",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGymIdAndTrainers();
  }, [user]);

  // Load contracts
  const loadContracts = async (gymId: string) => {
    try {
      const { data, error } = await supabase
        .from("trainer_contracts")
        .select(`
          id, 
          trainer_id, 
          contract_type, 
          start_date, 
          end_date, 
          monthly_fee, 
          percentage, 
          notes, 
          file_url, 
          created_at
        `)
        .eq("gym_id", gymId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get trainer names
      const contractsWithNames = await Promise.all(
        (data || []).map(async (contract) => {
          const { data: trainerData } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", contract.trainer_id)
            .single();
          
          return {
            ...contract,
            trainer_name: trainerData?.full_name || "Unknown",
          };
        })
      );

      setContracts(contractsWithNames);
    } catch (error) {
      console.error("Error loading contracts:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile caricare i contratti",
        variant: "destructive",
      });
    }
  };

  // Load insurances
  const loadInsurances = async (gymId: string) => {
    try {
      const { data, error } = await supabase
        .from("trainer_insurance")
        .select(`
          id, 
          trainer_id, 
          policy_number, 
          start_date, 
          end_date, 
          notes, 
          file_url, 
          created_at
        `)
        .eq("gym_id", gymId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get trainer names
      const insurancesWithNames = await Promise.all(
        (data || []).map(async (insurance) => {
          const { data: trainerData } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", insurance.trainer_id)
            .single();
          
          return {
            ...insurance,
            trainer_name: trainerData?.full_name || "Unknown",
          };
        })
      );

      setInsurances(insurancesWithNames);
    } catch (error) {
      console.error("Error loading insurances:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile caricare le polizze assicurative",
        variant: "destructive",
      });
    }
  };

  // Filter contracts by trainer
  const filteredContracts = selectedTrainer 
    ? contracts.filter(contract => contract.trainer_id === selectedTrainer)
    : contracts;

  // Filter insurances by trainer
  const filteredInsurances = selectedTrainer 
    ? insurances.filter(insurance => insurance.trainer_id === selectedTrainer)
    : insurances;

  // Handle contract form submission
  const onContractSubmit = async (data: ContractFormValues) => {
    if (!gymId) {
      toast({
        title: "Errore",
        description: "ID palestra non disponibile",
        variant: "destructive",
      });
      return;
    }

    setUploadingContract(true);

    try {
      let fileUrl = editContract?.file_url || null;

      // Upload file if provided
      if (data.file && data.file.length > 0) {
        const file = data.file[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `contracts/${data.trainer_id}/${Date.now()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('trainer_documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        if (uploadData) {
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('trainer_documents')
            .getPublicUrl(fileName);

          fileUrl = publicUrl;
        }
      }

      const contractData = {
        gym_id: gymId,
        trainer_id: data.trainer_id,
        contract_type: data.contract_type,
        start_date: data.start_date,
        end_date: data.end_date || null,
        monthly_fee: data.contract_type === 'vat_fixed_fee' ? data.monthly_fee : null,
        percentage: data.contract_type === 'vat_percentage' ? data.percentage : null,
        notes: data.notes || null,
        file_url: fileUrl,
      };

      if (editContract) {
        // Update existing contract
        const { error } = await supabase
          .from('trainer_contracts')
          .update(contractData)
          .eq('id', editContract.id);

        if (error) throw error;

        toast({
          title: "Successo",
          description: "Contratto aggiornato correttamente",
        });
      } else {
        // Insert new contract
        const { error } = await supabase
          .from('trainer_contracts')
          .insert(contractData);

        if (error) throw error;

        toast({
          title: "Successo",
          description: "Contratto creato correttamente",
        });
      }

      // Reload contracts and reset form
      if (gymId) {
        loadContracts(gymId);
      }
      contractForm.reset();
      setContractDialogOpen(false);
      setEditContract(null);
    } catch (error) {
      console.error('Error saving contract:', error);
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare il contratto",
        variant: "destructive",
      });
    } finally {
      setUploadingContract(false);
    }
  };

  // Handle insurance form submission
  const onInsuranceSubmit = async (data: InsuranceFormValues) => {
    if (!gymId) {
      toast({
        title: "Errore",
        description: "ID palestra non disponibile",
        variant: "destructive",
      });
      return;
    }

    setUploadingInsurance(true);

    try {
      let fileUrl = editInsurance?.file_url || null;

      // Upload file if provided
      if (data.file && data.file.length > 0) {
        const file = data.file[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `insurance/${data.trainer_id}/${Date.now()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('trainer_documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        if (uploadData) {
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('trainer_documents')
            .getPublicUrl(fileName);

          fileUrl = publicUrl;
        }
      }

      const insuranceData = {
        gym_id: gymId,
        trainer_id: data.trainer_id,
        policy_number: data.policy_number || null,
        start_date: data.start_date,
        end_date: data.end_date,
        notes: data.notes || null,
        file_url: fileUrl,
      };

      if (editInsurance) {
        // Update existing insurance
        const { error } = await supabase
          .from('trainer_insurance')
          .update(insuranceData)
          .eq('id', editInsurance.id);

        if (error) throw error;

        toast({
          title: "Successo",
          description: "Polizza assicurativa aggiornata correttamente",
        });
      } else {
        // Insert new insurance
        const { error } = await supabase
          .from('trainer_insurance')
          .insert(insuranceData);

        if (error) throw error;

        toast({
          title: "Successo", 
          description: "Polizza assicurativa creata correttamente",
        });
      }

      // Reload insurances and reset form
      if (gymId) {
        loadInsurances(gymId);
      }
      insuranceForm.reset();
      setInsuranceDialogOpen(false);
      setEditInsurance(null);
    } catch (error) {
      console.error('Error saving insurance:', error);
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare la polizza assicurativa",
        variant: "destructive",
      });
    } finally {
      setUploadingInsurance(false);
    }
  };

  // Delete contract
  const deleteContract = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo contratto?")) return;

    try {
      const { error } = await supabase
        .from('trainer_contracts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Contratto eliminato correttamente",
      });

      if (gymId) {
        loadContracts(gymId);
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast({
        title: "Errore",
        description: "Non è stato possibile eliminare il contratto",
        variant: "destructive",
      });
    }
  };

  // Delete insurance
  const deleteInsurance = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa polizza assicurativa?")) return;

    try {
      const { error } = await supabase
        .from('trainer_insurance')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Polizza assicurativa eliminata correttamente",
      });

      if (gymId) {
        loadInsurances(gymId);
      }
    } catch (error) {
      console.error('Error deleting insurance:', error);
      toast({
        title: "Errore",
        description: "Non è stato possibile eliminare la polizza assicurativa",
        variant: "destructive",
      });
    }
  };

  // Edit contract
  const handleEditContract = (contract: Contract) => {
    setEditContract(contract);
    contractForm.reset({
      trainer_id: contract.trainer_id,
      contract_type: contract.contract_type,
      start_date: format(new Date(contract.start_date), "yyyy-MM-dd"),
      end_date: contract.end_date ? format(new Date(contract.end_date), "yyyy-MM-dd") : undefined,
      monthly_fee: contract.monthly_fee ?? undefined,
      percentage: contract.percentage ?? undefined,
      notes: contract.notes ?? "",
    });
    setContractDialogOpen(true);
  };

  // Edit insurance
  const handleEditInsurance = (insurance: Insurance) => {
    setEditInsurance(insurance);
    insuranceForm.reset({
      trainer_id: insurance.trainer_id,
      policy_number: insurance.policy_number ?? "",
      start_date: format(new Date(insurance.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(insurance.end_date), "yyyy-MM-dd"),
      notes: insurance.notes ?? "",
    });
    setInsuranceDialogOpen(true);
  };

  // New contract
  const handleNewContract = () => {
    setEditContract(null);
    contractForm.reset({
      trainer_id: selectedTrainer || "",
      contract_type: "collaboration",
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: "",
      monthly_fee: undefined,
      percentage: undefined,
      notes: "",
    });
    setContractDialogOpen(true);
  };

  // New insurance
  const handleNewInsurance = () => {
    setEditInsurance(null);
    insuranceForm.reset({
      trainer_id: selectedTrainer || "",
      policy_number: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
      notes: "",
    });
    setInsuranceDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="contracts">Contratti</TabsTrigger>
          <TabsTrigger value="insurance">Polizze Assicurative</TabsTrigger>
        </TabsList>

        <div className="mb-6 flex items-center space-x-4">
          <div className="flex-1">
            <Select
              value={selectedTrainer || ""}
              onValueChange={(value) => setSelectedTrainer(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtra per trainer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutti i trainer</SelectItem>
                {trainers.map((trainer) => (
                  <SelectItem key={trainer.id} value={trainer.id}>
                    {trainer.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleNewContract} className="ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Contratto
          </Button>
          <Button onClick={handleNewInsurance}>
            <Plus className="mr-2 h-4 w-4" />
            Nuova Polizza
          </Button>
        </div>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contratti Trainer
              </CardTitle>
              <CardDescription>
                Gestisci i contratti dei trainer della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredContracts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <Shield className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">Nessun contratto</h3>
                  <p className="text-sm text-muted-foreground">
                    Non ci sono contratti registrati per i trainer selezionati.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trainer</TableHead>
                        <TableHead>Tipo Contratto</TableHead>
                        <TableHead>Data Inizio</TableHead>
                        <TableHead>Data Fine</TableHead>
                        <TableHead>Condizioni</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.map((contract) => {
                        // Format contract conditions display
                        let conditions = "";
                        if (contract.contract_type === "vat_fixed_fee" && contract.monthly_fee) {
                          conditions = `${contract.monthly_fee} € al mese`;
                        } else if (contract.contract_type === "vat_percentage" && contract.percentage) {
                          conditions = `${contract.percentage}% di commissione`;
                        }

                        // Format contract type display
                        let contractTypeDisplay = "";
                        switch(contract.contract_type) {
                          case "collaboration":
                            contractTypeDisplay = "Collaborazione";
                            break;
                          case "vat_fixed_fee":
                            contractTypeDisplay = "P.IVA (Quota Fissa)";
                            break;
                          case "vat_percentage":
                            contractTypeDisplay = "P.IVA (Percentuale)";
                            break;
                        }

                        return (
                          <TableRow key={contract.id}>
                            <TableCell>{contract.trainer_name}</TableCell>
                            <TableCell>{contractTypeDisplay}</TableCell>
                            <TableCell>{format(new Date(contract.start_date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>
                              {contract.end_date 
                                ? format(new Date(contract.end_date), "dd/MM/yyyy")
                                : "Indeterminato"}
                            </TableCell>
                            <TableCell>{conditions}</TableCell>
                            <TableCell>
                              {contract.file_url ? (
                                <a 
                                  href={contract.file_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:underline"
                                >
                                  <Download className="mr-1 h-4 w-4" />
                                  Scarica
                                </a>
                              ) : (
                                <span className="text-muted-foreground">Nessun file</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => handleEditContract(contract)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => deleteContract(contract.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Polizze Assicurative
              </CardTitle>
              <CardDescription>
                Gestisci le polizze assicurative dei trainer della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredInsurances.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <Shield className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">Nessuna polizza</h3>
                  <p className="text-sm text-muted-foreground">
                    Non ci sono polizze assicurative registrate per i trainer selezionati.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trainer</TableHead>
                        <TableHead>Numero Polizza</TableHead>
                        <TableHead>Data Inizio</TableHead>
                        <TableHead>Data Scadenza</TableHead>
                        <TableHead>Stato</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInsurances.map((insurance) => {
                        const now = new Date();
                        const endDate = new Date(insurance.end_date);
                        const isExpired = endDate < now;
                        // Warning if expires in 30 days
                        const isAboutToExpire = !isExpired && endDate < new Date(now.setDate(now.getDate() + 30));
                        
                        return (
                          <TableRow key={insurance.id}>
                            <TableCell>{insurance.trainer_name}</TableCell>
                            <TableCell>{insurance.policy_number || "N/A"}</TableCell>
                            <TableCell>{format(new Date(insurance.start_date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{format(new Date(insurance.end_date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>
                              {isExpired ? (
                                <div className="flex items-center text-destructive">
                                  <XCircle className="mr-1 h-4 w-4" />
                                  Scaduta
                                </div>
                              ) : isAboutToExpire ? (
                                <div className="flex items-center text-amber-500">
                                  <AlertCircle className="mr-1 h-4 w-4" />
                                  In scadenza
                                </div>
                              ) : (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle2 className="mr-1 h-4 w-4" />
                                  Valida
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {insurance.file_url ? (
                                <a 
                                  href={insurance.file_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:underline"
                                >
                                  <Download className="mr-1 h-4 w-4" />
                                  Scarica
                                </a>
                              ) : (
                                <span className="text-muted-foreground">Nessun file</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => handleEditInsurance(insurance)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => deleteInsurance(insurance.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contract Dialog */}
      <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editContract ? "Modifica Contratto" : "Nuovo Contratto"}</DialogTitle>
            <DialogDescription>
              {editContract 
                ? "Modifica i dettagli del contratto esistente" 
                : "Aggiungi un nuovo contratto per un trainer"}
            </DialogDescription>
          </DialogHeader>

          <Form {...contractForm}>
            <form onSubmit={contractForm.handleSubmit(onContractSubmit)} className="space-y-6">
              <FormField
                control={contractForm.control}
                name="trainer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!!editContract}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un trainer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trainers.map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.id}>
                            {trainer.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contractForm.control}
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo Contratto</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona tipo contratto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="collaboration">Contratto di Collaborazione</SelectItem>
                        <SelectItem value="vat_fixed_fee">P.IVA (Quota Fissa)</SelectItem>
                        <SelectItem value="vat_percentage">P.IVA (Percentuale)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={contractForm.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Inizio</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contractForm.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Fine (opzionale)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Lascia vuoto se a tempo indeterminato</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {contractForm.watch("contract_type") === "vat_fixed_fee" && (
                <FormField
                  control={contractForm.control}
                  name="monthly_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quota Mensile Fissa (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {contractForm.watch("contract_type") === "vat_percentage" && (
                <FormField
                  control={contractForm.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentuale (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          max="100"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={contractForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (opzionale)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contractForm.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Documento (opzionale)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps} 
                      />
                    </FormControl>
                    <FormDescription>
                      Carica il contratto in formato PDF o Word
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setContractDialogOpen(false)}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={uploadingContract}>
                  {uploadingContract ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>Salva Contratto</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Insurance Dialog */}
      <Dialog open={insuranceDialogOpen} onOpenChange={setInsuranceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editInsurance ? "Modifica Polizza" : "Nuova Polizza"}</DialogTitle>
            <DialogDescription>
              {editInsurance 
                ? "Modifica i dettagli della polizza assicurativa esistente" 
                : "Aggiungi una nuova polizza assicurativa per un trainer"}
            </DialogDescription>
          </DialogHeader>

          <Form {...insuranceForm}>
            <form onSubmit={insuranceForm.handleSubmit(onInsuranceSubmit)} className="space-y-6">
              <FormField
                control={insuranceForm.control}
                name="trainer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!!editInsurance}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un trainer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trainers.map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.id}>
                            {trainer.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={insuranceForm.control}
                name="policy_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero Polizza (opzionale)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={insuranceForm.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Inizio</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={insuranceForm.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Scadenza</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={insuranceForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (opzionale)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={insuranceForm.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Documento (opzionale)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps} 
                      />
                    </FormControl>
                    <FormDescription>
                      Carica la polizza in formato PDF o Word
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setInsuranceDialogOpen(false)}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={uploadingInsurance}>
                  {uploadingInsurance ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>Salva Polizza</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
