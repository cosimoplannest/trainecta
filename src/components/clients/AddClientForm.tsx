
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { it } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  first_name: z.string().min(1, "Il nome è richiesto"),
  last_name: z.string().min(1, "Il cognome è richiesto"),
  email: z.string().email("Email non valida").optional().or(z.literal("")),
  phone: z.string().optional(),
  gender: z.string().optional(),
  birth_date: z.date().optional(),
  joined_at: z.date(),
  source: z.string().optional(),
  subscription_id: z.string().optional(),
  assigned_to: z.string().optional(),
  internal_notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddClientFormProps {
  onClientAdded: () => void;
}

const AddClientForm = ({ onClientAdded }: AddClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainers, setTrainers] = useState<{ id: string; full_name: string }[]>([]);
  const [subscriptions, setSubscriptions] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: undefined,
      source: undefined,
      internal_notes: "",
      joined_at: new Date(),
    },
  });

  // Fetch trainers and subscriptions when component mounts
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("role", "trainer");

        if (error) throw error;
        setTrainers(data || []);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    const fetchSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("id, name");

        if (error) throw error;
        setSubscriptions(data || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchTrainers();
    fetchSubscriptions();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Format date properly for database
      const formattedData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || null,
        phone: data.phone || null,
        gender: data.gender || null,
        birth_date: data.birth_date ? data.birth_date.toISOString() : null,
        joined_at: data.joined_at.toISOString(),
        subscription_id: data.subscription_id || null,
        assigned_to: data.assigned_to || null,
        source: data.source || null,
        internal_notes: data.internal_notes || null,
        // Add the required gym_id field - using a hardcoded value for now
        // In a real app, this would come from user context or similar
        gym_id: "11111111-1111-1111-1111-111111111111"
      };

      const { error } = await supabase.from("clients").insert(formattedData);

      if (error) throw error;

      toast({
        title: "Cliente aggiunto con successo",
        description: `${data.first_name} ${data.last_name} è stato aggiunto.`,
      });

      form.reset();
      onClientAdded();
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({
        title: "Errore",
        description: `Si è verificato un errore: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aggiungi Nuovo Cliente</CardTitle>
        <CardDescription>
          Inserisci le informazioni per registrare un nuovo cliente.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cognome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Rossi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="mario.rossi@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input placeholder="+39 123 456 7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sesso</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Uomo</SelectItem>
                        <SelectItem value="female">Donna</SelectItem>
                        <SelectItem value="other">Altro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data di nascita</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: it })
                            ) : (
                              <span>Seleziona data...</span>
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
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="joined_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data iscrizione *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: it })
                            ) : (
                              <span>Seleziona data...</span>
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
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origine</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="walk-in">Visita diretta</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="web">Web</SelectItem>
                        <SelectItem value="social">Social media</SelectItem>
                        <SelectItem value="other">Altro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscription_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abbonamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subscriptions.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
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
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assegna a Trainer</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona..." />
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
              name="internal_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note interne</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Inserisci qui eventuali note..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Note visibili solo a staff e trainer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : "Salva Cliente"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AddClientForm;
