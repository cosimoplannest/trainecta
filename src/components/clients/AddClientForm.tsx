
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, User, Phone, Mail, Home, CreditCard, Clock, Target, Activity } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const workoutTimePreferences = [
  { id: "early_morning", label: "Prima Mattina (7:00 - 10:00)" },
  { id: "lunch", label: "Pranzo (10:00 - 14:00)" },
  { id: "early_afternoon", label: "Primo Pomeriggio (14:00 - 17:00)" },
  { id: "late_afternoon", label: "Tardo Pomeriggio (17:00 - 20:00)" },
  { id: "evening", label: "Sera (20:00 - 22:00)" },
];

const fitnessGoals = [
  { id: "weight_loss", label: "Dimagrimento" },
  { id: "toning", label: "Tonificazione" },
  { id: "postural", label: "Posturale" },
  { id: "functional", label: "Funzionale" },
  { id: "bodybuilding", label: "Bodybuilding" },
  { id: "powerlifting", label: "Powerlifting" },
];

const fitnessLevels = [
  { id: "beginner", label: "Base" },
  { id: "intermediate", label: "Intermedio" },
  { id: "advanced", label: "Avanzato" },
];

const formSchema = z.object({
  // Dati Anagrafici & Contatti
  first_name: z.string().min(1, "Il nome è richiesto"),
  last_name: z.string().min(1, "Il cognome è richiesto"),
  birth_date: z.date({ required_error: "La data di nascita è richiesta" }),
  gender: z.string({ required_error: "Il sesso è richiesto" }),
  fiscal_code: z.string().optional(),
  phone: z.string({ required_error: "Il numero di telefono è richiesto" }),
  email: z.string().email("Email non valida").optional().or(z.literal("")),
  address: z.string().optional(),
  
  // Abbonamento e Preferenze
  subscription_id: z.string().optional(),
  subscription_duration: z.string().optional(),
  subscription_start_date: z.date().optional(),
  subscription_end_date: z.date().optional(),
  preferred_time: z.string().optional(),
  primary_goal: z.string().optional(),
  fitness_level: z.string().optional(),
  
  // Altri campi esistenti
  source: z.string().optional(),
  assigned_to: z.string().optional(),
  internal_notes: z.string().optional(),
  joined_at: z.date(),
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
      address: "",
      fiscal_code: "",
      source: undefined,
      subscription_duration: undefined,
      preferred_time: undefined,
      primary_goal: undefined,
      fitness_level: undefined,
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
        fiscal_code: data.fiscal_code || null,
        address: data.address || null,
        joined_at: data.joined_at.toISOString(),
        subscription_id: data.subscription_id || null,
        subscription_duration: data.subscription_duration || null,
        subscription_start_date: data.subscription_start_date ? data.subscription_start_date.toISOString() : null,
        subscription_end_date: data.subscription_end_date ? data.subscription_end_date.toISOString() : null,
        preferred_time: data.preferred_time || null,
        primary_goal: data.primary_goal || null,
        fitness_level: data.fitness_level || null,
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
          <CardContent className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium flex items-center mb-4">
                <User className="mr-2 h-5 w-5" /> Dati Anagrafici & Contatti
              </h3>
              
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data di nascita *</FormLabel>
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sesso *</FormLabel>
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
                  name="fiscal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codice Fiscale</FormLabel>
                      <FormControl>
                        <Input placeholder="RSSMRO80A01H501V" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono *</FormLabel>
                      <FormControl>
                        <Input placeholder="+39 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indirizzo di residenza</FormLabel>
                      <FormControl>
                        <Input placeholder="Via Roma 123, 00100 Roma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium flex items-center mb-4">
                <CreditCard className="mr-2 h-5 w-5" /> Abbonamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subscription_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo di abbonamento</FormLabel>
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
                  name="subscription_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durata abbonamento</FormLabel>
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
                          <SelectItem value="monthly">Mensile</SelectItem>
                          <SelectItem value="quarterly">Trimestrale</SelectItem>
                          <SelectItem value="semiannual">Semestrale</SelectItem>
                          <SelectItem value="annual">Annuale</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="subscription_start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data inizio abbonamento</FormLabel>
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
                  name="subscription_end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data scadenza abbonamento</FormLabel>
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
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium flex items-center mb-4">
                <Clock className="mr-2 h-5 w-5" /> Preferenze di Allenamento
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="preferred_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fascia oraria di allenamento preferita</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          {workoutTimePreferences.map((time) => (
                            <FormItem key={time.id} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={time.id} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {time.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium flex items-center mb-4">
                <Target className="mr-2 h-5 w-5" /> Obiettivi e Livello
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primary_goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obiettivo primario</FormLabel>
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
                          {fitnessGoals.map((goal) => (
                            <SelectItem key={goal.id} value={goal.id}>
                              {goal.label}
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
                  name="fitness_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Livello attuale di forma fisica</FormLabel>
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
                          {fitnessLevels.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
