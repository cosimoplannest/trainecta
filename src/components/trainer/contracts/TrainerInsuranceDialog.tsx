
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { createTrainerInsurance, updateTrainerInsurance } from "./api";
import { useAuth } from "@/hooks/use-auth";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { it } from "date-fns/locale";
import type { TrainerInsuranceDialogProps, InsuranceFile } from "./types";

export function TrainerInsuranceDialog({
  open,
  onOpenChange,
  trainerId,
  insurance,
  onSuccess
}: TrainerInsuranceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm({
    defaultValues: {
      policy_number: insurance?.policy_number || "",
      start_date: insurance?.start_date ? new Date(insurance.start_date) : new Date(),
      end_date: insurance?.end_date ? new Date(insurance.end_date) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      notes: insurance?.notes || ""
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      
      const gymId = user?.user_metadata?.gym_id;
      if (!gymId) {
        toast({
          title: "Errore",
          description: "ID della palestra mancante",
          variant: "destructive",
        });
        return;
      }

      const insuranceData = {
        trainer_id: trainerId,
        gym_id: gymId,
        policy_number: values.policy_number,
        start_date: values.start_date.toISOString().split('T')[0],
        end_date: values.end_date.toISOString().split('T')[0],
        notes: values.notes,
        file_url: insurance?.file_url
      };

      let result;
      if (insurance) {
        result = await updateTrainerInsurance(insurance.id, insuranceData, file || undefined);
      } else {
        result = await createTrainerInsurance(insuranceData, file || undefined);
      }

      if (result) {
        toast({
          title: "Successo",
          description: insurance 
            ? "Assicurazione aggiornata con successo" 
            : "Assicurazione registrata con successo",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      console.error("Error submitting insurance form:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio dell'assicurazione",
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
            {insurance ? "Modifica Assicurazione" : "Aggiungi Assicurazione"}
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
                    <Input placeholder="Numero della polizza" {...field} />
                  </FormControl>
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
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: it })
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
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Fine</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: it })
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
                          disabled={(date) => date < form.getValues("start_date")}
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Note (opzionale)</label>
              <Textarea
                {...form.register("notes")}
                placeholder="Note sull'assicurazione..."
                className="resize-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Documento (PDF)</label>
              <div className="flex items-center gap-2">
                {insurance?.file_url && (
                  <a
                    href={insurance.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Visualizza documento attuale
                  </a>
                )}
              </div>
              <Input
                type="file"
                accept=".pdf"
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  "Salva Assicurazione"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
