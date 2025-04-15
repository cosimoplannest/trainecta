
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
import { CalendarIcon, FileUp, LoaderCircle, Plus, Ban } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

const reasonOptions = [
  { value: "illness" as UnavailabilityReason, label: "Malattia" },
  { value: "injury" as UnavailabilityReason, label: "Infortunio" },
  { value: "vacation" as UnavailabilityReason, label: "Ferie" },
  { value: "personal" as UnavailabilityReason, label: "Motivi personali" },
  { value: "other" as UnavailabilityReason, label: "Altro" },
];

export function UserUnavailability() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [unavailabilities, setUnavailabilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      reason: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchUnavailabilities();
    }
  }, [user]);

  const fetchUnavailabilities = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_unavailability")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      setUnavailabilities(data || []);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati di indisponibilità",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      setIsSheetOpen(false);
      fetchUnavailabilities();
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
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestione Indisponibilità</h2>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Segnala Indisponibilità</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Segnala Indisponibilità</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
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
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : unavailabilities.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motivo</TableHead>
                <TableHead>Data Inizio</TableHead>
                <TableHead>Data Fine</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unavailabilities.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {
                      reasonOptions.find(option => option.value === item.reason)?.label || 
                      item.reason
                    }
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.start_date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.end_date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {item.notes ? item.notes : "-"}
                  </TableCell>
                  <TableCell>
                    {item.document_url ? (
                      <a
                        href={`https://nvzgwtgexahpnenjnhgr.supabase.co/storage/v1/object/public/documents/${item.document_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center"
                      >
                        <FileUp className="h-4 w-4 mr-1" />
                        Visualizza
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Approvato
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-muted/50 flex flex-col items-center justify-center rounded-lg p-8 text-center">
          <Ban className="mb-2 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">Nessuna indisponibilità</h3>
          <p className="text-sm text-muted-foreground">
            Non hai registrato periodi di indisponibilità. Utilizza il pulsante "Segnala Indisponibilità" per registrarne uno.
          </p>
        </div>
      )}
    </div>
  );
}
