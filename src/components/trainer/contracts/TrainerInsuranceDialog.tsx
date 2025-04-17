
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { upsertTrainerInsurance } from "./api";
import { TrainerInsuranceDialogProps, InsuranceFile } from "./types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function TrainerInsuranceDialog({
  open,
  onOpenChange,
  trainerId,
  insurance,
  onSuccess
}: TrainerInsuranceDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm({
    defaultValues: {
      policy_number: "",
      start_date: new Date(),
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      notes: "",
    }
  });

  const isTrainer = user?.id === trainerId;

  // Reset the form when the dialog opens or when the insurance changes
  useEffect(() => {
    if (open && insurance) {
      form.reset({
        policy_number: insurance.policy_number || "",
        start_date: insurance.start_date ? new Date(insurance.start_date) : new Date(),
        end_date: insurance.end_date ? new Date(insurance.end_date) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        notes: insurance.notes || "",
      });
    } else if (open) {
      form.reset({
        policy_number: "",
        start_date: new Date(),
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        notes: "",
      });
      setFile(null);
    }
  }, [open, insurance, form]);

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

    if (!isTrainer) {
      toast({
        title: "Permesso negato",
        description: "Solo i trainer possono caricare le proprie polizze assicurative",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const insuranceData: Partial<InsuranceFile> = {
        trainer_id: trainerId,
        gym_id: user.user_metadata.gym_id,
        policy_number: data.policy_number || null,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        end_date: format(data.end_date, 'yyyy-MM-dd'),
        notes: data.notes || null,
      };

      if (insurance?.id) {
        insuranceData.id = insurance.id;
        insuranceData.file_url = insurance.file_url;
      }

      await upsertTrainerInsurance(insuranceData, file || undefined);
      
      toast({
        title: "Polizza assicurativa salvata",
        description: "La polizza assicurativa è stata salvata con successo",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving insurance:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio della polizza assicurativa",
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
            {insurance ? "Modifica Polizza Assicurativa" : "Aggiungi Polizza Assicurativa"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="policy_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero Polizza (opzionale)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Inserisci il numero della polizza"
                      disabled={!isTrainer || isSubmitting}
                      {...field}
                    />
                  </FormControl>
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
                            disabled={!isTrainer || isSubmitting}
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
                    <FormLabel>Data Scadenza</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!isTrainer || isSubmitting}
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (opzionale)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Note sulla polizza assicurativa..."
                      className="resize-none"
                      disabled={!isTrainer || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <FormLabel>Polizza Assicurativa (PDF)</FormLabel>
              <div className="flex items-center gap-2">
                {insurance?.file_url && (
                  <a
                    href={insurance.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Visualizza polizza attuale
                  </a>
                )}
              </div>
              <Input
                type="file"
                accept=".pdf"
                disabled={!isTrainer || isSubmitting}
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
                disabled={!isTrainer || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  "Salva Polizza"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
