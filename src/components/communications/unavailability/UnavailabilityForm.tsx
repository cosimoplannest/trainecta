
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format, isAfter } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { it } from "date-fns/locale";
import { Database } from "@/integrations/supabase/types";

type FormValues = {
  reason: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  documentFile?: FileList;
};

type UnavailabilityReason = Database["public"]["Enums"]["unavailability_reason"];
type AppRole = Database["public"]["Enums"]["app_role"];

type UnavailabilityFormProps = {
  onSuccess: () => void;
  onClose: () => void;
};

const reasonOptions = [
  { value: "illness" as UnavailabilityReason, label: "Malattia" },
  { value: "injury" as UnavailabilityReason, label: "Infortunio" },
  { value: "vacation" as UnavailabilityReason, label: "Ferie" },
  { value: "personal" as UnavailabilityReason, label: "Motivi personali" },
  { value: "other" as UnavailabilityReason, label: "Altro" },
];

export function UnavailabilityForm({ onSuccess, onClose }: UnavailabilityFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      reason: "",
      notes: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const uploadDocument = async (file: File) => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `unavailability/${fileName}`;
    
    try {
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      return filePath;
    } catch (error: any) {
      console.error("Error uploading document:", error);
      throw error;
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user || !data.startDate || !data.endDate) return;
    
    // Validate end date is after start date
    if (isAfter(data.startDate, data.endDate)) {
      toast({
        title: "Errore date",
        description: "La data di fine deve essere successiva alla data di inizio",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      let documentUrl = null;
      
      if (selectedFile) {
        documentUrl = await uploadDocument(selectedFile);
      }
      
      const { error } = await supabase.from("user_unavailability").insert({
        user_id: user.id,
        user_role: "trainer" as AppRole,
        reason: data.reason as UnavailabilityReason,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
        notes: data.notes || null,
        document_url: documentUrl,
        gym_id: "00000000-0000-0000-0000-000000000000",
      });

      if (error) {
        console.error("Error inserting unavailability:", error);
        throw error;
      }

      toast({
        title: "Indisponibilità registrata",
        description: "La tua indisponibilità è stata registrata con successo.",
      });
      
      form.reset();
      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore nella registrazione dell'indisponibilità",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reason"
          rules={{ required: "Il motivo è obbligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un motivo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {reasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            rules={{ required: "La data di inizio è obbligatoria" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Inizio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "PP", { locale: it })
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
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            rules={{ required: "La data di fine è obbligatoria" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Fine</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "PP", { locale: it })
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
                      initialFocus
                      className="pointer-events-auto"
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
                  placeholder="Inserisci eventuali note..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Allega Certificato (opzionale)</FormLabel>
          <div className="mt-2">
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="mt-2 text-xs text-muted-foreground">
                File selezionato: {selectedFile.name}
              </p>
            )}
          </div>
        </FormItem>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Invio in corso...
            </>
          ) : (
            "Invia segnalazione"
          )}
        </Button>
      </form>
    </Form>
  );
}
