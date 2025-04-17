import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { upsertTrainerContract } from "./api";
import { TrainerContractDialogProps, ContractFile } from "./types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function TrainerContractDialog({
  open,
  onOpenChange,
  trainerId,
  contract,
  onSuccess,
  isAdmin
}: TrainerContractDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm({
    defaultValues: {
      contract_type: "freelance" as "employee" | "freelance" | "consultant",
      start_date: new Date(),
      end_date: null as Date | null,
      monthly_fee: "" as unknown as number,
      percentage: "" as unknown as number,
      notes: "",
    }
  });

  useEffect(() => {
    if (open && contract) {
      form.reset({
        contract_type: contract.contract_type,
        start_date: contract.start_date ? new Date(contract.start_date) : new Date(),
        end_date: contract.end_date ? new Date(contract.end_date) : null,
        monthly_fee: contract.monthly_fee || undefined,
        percentage: contract.percentage || undefined,
        notes: contract.notes || "",
      });
    } else if (open) {
      form.reset({
        contract_type: "freelance",
        start_date: new Date(),
        end_date: null,
        monthly_fee: undefined,
        percentage: undefined,
        notes: "",
      });
      setFile(null);
    }
  }, [open, contract, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per eseguire questa operazione",
        variant: "destructive",
      });
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Permesso negato",
        description: "Solo gli amministratori possono gestire i contratti",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const contractData: Partial<ContractFile> = {
        trainer_id: trainerId,
        gym_id: user.user_metadata.gym_id,
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
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {contract ? "Modifica Contratto" : "Aggiungi Contratto"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contract_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo Contratto</FormLabel>
                  <Select
                    disabled={!isAdmin || isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo contratto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employee">Dipendente</SelectItem>
                      <SelectItem value="freelance">Libero Professionista</SelectItem>
                      <SelectItem value="consultant">Consulente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Inizio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!isAdmin || isSubmitting}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Seleziona data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Fine (opzionale)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!isAdmin || isSubmitting}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Seleziona data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01") ||
                            (form.getValues().start_date
                              ? date < form.getValues().start_date
                              : false)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthly_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compenso Mensile (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={!isAdmin || isSubmitting}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentuale (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        disabled={!isAdmin || isSubmitting}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (opzionale)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Note sul contratto..."
                      className="resize-none"
                      disabled={!isAdmin || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <FormLabel>Contratto (PDF)</FormLabel>
              <div className="flex items-center gap-2">
                {contract?.file_url && (
                  <a
                    href={contract.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Visualizza contratto attuale
                  </a>
                )}
              </div>
              <Input
                type="file"
                accept=".pdf"
                disabled={!isAdmin || isSubmitting}
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  File selezionato: {file.name}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annulla
              </Button>
              <Button 
                type="submit"
                disabled={!isAdmin || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  "Salva Contratto"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
