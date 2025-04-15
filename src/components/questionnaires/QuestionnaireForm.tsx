import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type CompiledByRole = "trainer" | "admin" | "operator" | "assistant" | "instructor";

const formSchema = z.object({
  client_id: z.string().uuid({ message: "Seleziona un cliente" }),
  trainer_id: z.string().uuid().optional(),
  purchased: z.boolean(),
  reason_not_purchased: z.string().optional(),
  custom_reason: z.string().optional(),
  future_interest: z.boolean().optional(),
});

interface QuestionnaireFormProps {
  onClose: (refreshData?: boolean) => void;
}

const QuestionnaireForm = ({ onClose }: QuestionnaireFormProps) => {
  const [clients, setClients] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");

  useEffect(() => {
    const fetchClientsAndTrainers = async () => {
      // Fetch clients
      const { data: clientsData } = await supabase
        .from("clients")
        .select("id, first_name, last_name")
        .order("last_name", { ascending: true });
      
      if (clientsData) {
        setClients(clientsData);
      }
      
      // Fetch trainers
      const { data: trainersData } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("role", "trainer")
        .order("full_name", { ascending: true });
      
      if (trainersData) {
        setTrainers(trainersData);
      }
    };
    
    fetchClientsAndTrainers();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchased: false,
      future_interest: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Prepare data for insertion
      const questionnaireData = {
        client_id: values.client_id,
        trainer_id: values.trainer_id || null,
        purchased: values.purchased,
        compiled_by_role: "trainer" as CompiledByRole,  // Explicitly cast to the allowed type
      };
      
      // If not purchased, add reason fields
      if (!values.purchased) {
        Object.assign(questionnaireData, {
          reason_not_purchased: values.reason_not_purchased,
          custom_reason: values.reason_not_purchased === "other" ? values.custom_reason : null,
          future_interest: values.future_interest || false,
        });
      }
      
      // Insert into database
      const { error } = await supabase
        .from("trial_questionnaires")
        .insert(questionnaireData);
      
      if (error) {
        console.error("Error saving questionnaire:", error);
        toast.error("Errore durante il salvataggio del questionario");
      } else {
        toast.success("Questionario salvato con successo");
        onClose(true);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Si è verificato un errore");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Nuovo questionario post prova</CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.first_name} {client.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="trainer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
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
            </div>
            
            <FormField
              control={form.control}
              name="purchased"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setIsPurchased(checked === true);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-base">
                      Il cliente ha acquistato dopo la prova?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {!isPurchased && (
              <>
                <FormField
                  control={form.control}
                  name="reason_not_purchased"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo per cui non ha acquistato</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedReason(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona un motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="price">Prezzo troppo alto</SelectItem>
                          <SelectItem value="not_interested">Non interessato</SelectItem>
                          <SelectItem value="location">Posizione scomoda</SelectItem>
                          <SelectItem value="time">Orari non compatibili</SelectItem>
                          <SelectItem value="other">Altro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedReason === "other" && (
                  <FormField
                    control={form.control}
                    name="custom_reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifica altro motivo</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Inserisci il motivo specifico"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="future_interest"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">
                          Potrebbe essere interessato in futuro?
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Annulla
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvataggio..." : "Salva questionario"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default QuestionnaireForm;
