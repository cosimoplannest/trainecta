import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Settings, Building, Phone, Link as LinkIcon } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

type TemplateSentBy = "trainer" | "system" | "both";
type SaleMethod = "package" | "custom" | "both";

type FormValues = {
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  max_trials_per_client: number;
  enable_auto_followup: boolean;
  days_to_first_followup: number;
  days_to_active_confirmation: number;
  template_sent_by: TemplateSentBy;
  template_viewable_by_client: boolean;
  allow_template_duplication: boolean;
  default_trainer_assignment_logic: string;
  sale_methods: string[];
};

export function GymSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gymId, setGymId] = useState<string | null>(null);
  const [gymSettingsId, setGymSettingsId] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postal_code: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      max_trials_per_client: 1,
      enable_auto_followup: true,
      days_to_first_followup: 7,
      days_to_active_confirmation: 30,
      template_sent_by: "both",
      template_viewable_by_client: true,
      allow_template_duplication: true,
      default_trainer_assignment_logic: "manual",
      sale_methods: ["both"],
    },
  });

  useEffect(() => {
    const fetchUserGymId = async () => {
      if (!user) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("gym_id")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;
        if (userData?.gym_id) {
          setGymId(userData.gym_id);
          return userData.gym_id;
        }
      } catch (error) {
        console.error("Error fetching user gym ID:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare i dati della palestra",
          variant: "destructive",
        });
        return null;
      }
    };

    const fetchGymSettings = async () => {
      setLoading(true);
      const userGymId = await fetchUserGymId();
      
      if (!userGymId) {
        setLoading(false);
        return;
      }

      try {
        const { data: gymData, error: gymError } = await supabase
          .from("gyms")
          .select("*")
          .eq("id", userGymId)
          .single();

        if (gymError) throw gymError;

        const { data: settingsData, error: settingsError } = await supabase
          .from("gym_settings")
          .select("*")
          .eq("gym_id", userGymId)
          .single();

        if (settingsError && settingsError.code !== "PGRST116") {
          throw settingsError;
        }

        const normalizeTemplateSentBy = (value: string | null): TemplateSentBy => {
          if (value === "trainer" || value === "system" || value === "both") {
            return value;
          }
          return "both";
        };

        // Determine sale methods from template_sent_by
        let saleMethods: string[] = ["both"];
        if (settingsData?.template_sent_by === "package") {
          saleMethods = ["package"];
        } else if (settingsData?.template_sent_by === "custom") {
          saleMethods = ["custom"];
        }

        form.reset({
          name: gymData?.name || "",
          address: gymData?.address || "",
          city: gymData?.city || "",
          postal_code: gymData?.postal_code || "",
          country: gymData?.country || "",
          phone: gymData?.phone || "",
          email: gymData?.email || "",
          website: gymData?.website || "",
          max_trials_per_client: settingsData?.max_trials_per_client || 1,
          enable_auto_followup: settingsData?.enable_auto_followup || true,
          days_to_first_followup: settingsData?.days_to_first_followup || 7,
          days_to_active_confirmation: settingsData?.days_to_active_confirmation || 30,
          template_sent_by: normalizeTemplateSentBy(settingsData?.template_sent_by),
          template_viewable_by_client: settingsData?.template_viewable_by_client || true,
          allow_template_duplication: settingsData?.allow_template_duplication || true,
          default_trainer_assignment_logic: settingsData?.default_trainer_assignment_logic || "manual",
          sale_methods: saleMethods,
        });

        if (settingsData) {
          setGymSettingsId(settingsData.id);
        }
      } catch (error) {
        console.error("Error fetching gym settings:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare le impostazioni della palestra",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGymSettings();
  }, [user, form]);

  const onSubmit = async (data: FormValues) => {
    if (!gymId) {
      toast({
        title: "Errore",
        description: "ID palestra non disponibile",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // Determine template_sent_by based on sale_methods
      let templateSentBy: TemplateSentBy = "both";
      if (data.sale_methods.length === 1) {
        if (data.sale_methods[0] === "package") {
          templateSentBy = "trainer";
        } else if (data.sale_methods[0] === "custom") {
          templateSentBy = "system";
        }
      }

      // Update gym data
      const { error: gymError } = await supabase
        .from("gyms")
        .update({ 
          name: data.name,
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
          country: data.country,
          phone: data.phone,
          email: data.email,
          website: data.website
        })
        .eq("id", gymId);

      if (gymError) throw gymError;

      const settingsData = {
        gym_id: gymId,
        max_trials_per_client: data.max_trials_per_client,
        enable_auto_followup: data.enable_auto_followup,
        days_to_first_followup: data.days_to_first_followup,
        days_to_active_confirmation: data.days_to_active_confirmation,
        template_sent_by: templateSentBy,
        template_viewable_by_client: data.template_viewable_by_client,
        allow_template_duplication: data.allow_template_duplication,
        default_trainer_assignment_logic: data.default_trainer_assignment_logic,
      };

      let settingsError;
      if (gymSettingsId) {
        const { error } = await supabase
          .from("gym_settings")
          .update(settingsData)
          .eq("id", gymSettingsId);
        
        settingsError = error;
      } else {
        const { error } = await supabase
          .from("gym_settings")
          .insert(settingsData);
        
        settingsError = error;
      }

      if (settingsError) throw settingsError;

      toast({
        title: "Successo",
        description: "Le impostazioni della palestra sono state salvate",
      });
    } catch (error) {
      console.error("Error saving gym settings:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare le impostazioni della palestra",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Generali</TabsTrigger>
          <TabsTrigger value="contact">Contatti</TabsTrigger>
          <TabsTrigger value="operational">Operative</TabsTrigger>
          <TabsTrigger value="advanced">Avanzate</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Impostazioni Generali
                  </CardTitle>
                  <CardDescription>
                    Configura le impostazioni di base della tua palestra
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Palestra</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome della palestra" {...field} />
                        </FormControl>
                        <FormDescription>
                          Il nome della tua palestra che apparirà in tutta l'applicazione
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_trials_per_client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numero Totale di Prove Gratuite</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Numero di prove gratuite disponibili per la tua palestra
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Informazioni di Contatto
                  </CardTitle>
                  <CardDescription>
                    Gestisci gli indirizzi e i dettagli di contatto della palestra
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indirizzo</FormLabel>
                        <FormControl>
                          <Input placeholder="Via Roma 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Città</FormLabel>
                          <FormControl>
                            <Input placeholder="Milano" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CAP</FormLabel>
                          <FormControl>
                            <Input placeholder="20100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paese</FormLabel>
                        <FormControl>
                          <Input placeholder="Italia" {...field} />
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
                          <div className="relative">
                            <Input 
                              placeholder="+39 123 456 7890" 
                              {...field}
                            />
                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          </div>
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
                          <Input placeholder="info@palestra.it" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Social/Website</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="https://www.instagram.com/tuapalestra" 
                              {...field}
                            />
                            <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Link al sito web o ai social media della palestra
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operational">
              <Card>
                <CardHeader>
                  <CardTitle>Impostazioni Operative</CardTitle>
                  <CardDescription>
                    Configura i parametri operativi della tua palestra
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="enable_auto_followup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Follow-up Automatico</FormLabel>
                          <FormDescription>
                            Attiva il follow-up automatico dei clienti
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("enable_auto_followup") && (
                    <FormField
                      control={form.control}
                      name="days_to_first_followup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giorni per il Primo Follow-up</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Numero di giorni prima del primo follow-up dopo una prova
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="days_to_active_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giorni per Conferma Cliente Attivo</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Giorni dopo i quali un cliente viene considerato attivo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sale_methods"
                    render={() => (
                      <FormItem>
                        <FormLabel>Metodo di Vendita Personal Trainer</FormLabel>
                        <div className="space-y-2">
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={form.watch("sale_methods").includes("package")}
                                onCheckedChange={(checked) => {
                                  const current = [...form.watch("sale_methods")];
                                  if (checked) {
                                    if (!current.includes("package")) {
                                      form.setValue("sale_methods", [...current, "package"]);
                                    }
                                  } else {
                                    form.setValue("sale_methods", current.filter(v => v !== "package"));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Pacchetti personal</FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={form.watch("sale_methods").includes("custom")}
                                onCheckedChange={(checked) => {
                                  const current = [...form.watch("sale_methods")];
                                  if (checked) {
                                    if (!current.includes("custom")) {
                                      form.setValue("sale_methods", [...current, "custom"]);
                                    }
                                  } else {
                                    form.setValue("sale_methods", current.filter(v => v !== "custom"));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Schede personalizzate</FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={form.watch("sale_methods").includes("both")}
                                onCheckedChange={(checked) => {
                                  const current = [...form.watch("sale_methods")];
                                  if (checked) {
                                    if (!current.includes("both")) {
                                      form.setValue("sale_methods", [...current, "both"]);
                                    }
                                  } else {
                                    form.setValue("sale_methods", current.filter(v => v !== "both"));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Entrambi</FormLabel>
                          </FormItem>
                        </div>
                        <FormDescription>
                          Seleziona i metodi di vendita PT supportati dalla palestra
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Impostazioni Avanzate</CardTitle>
                  <CardDescription>
                    Configura le impostazioni avanzate della piattaforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="template_sent_by"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invio Schede Workout</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona chi può inviare le schede" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="trainer">Solo Trainer</SelectItem>
                            <SelectItem value="system">Solo Sistema</SelectItem>
                            <SelectItem value="both">Entrambi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Chi può inviare le schede di workout ai clienti
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="template_viewable_by_client"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Visibilità Schede ai Clienti</FormLabel>
                          <FormDescription>
                            I clienti possono visualizzare le schede assegnate
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allow_template_duplication"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Duplicazione Schede</FormLabel>
                          <FormDescription>
                            Abilita la duplicazione delle schede di workout
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="default_trainer_assignment_logic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logica Assegnazione Trainer</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="manual">Manuale</option>
                            <option value="round_robin">Round Robin</option>
                            <option value="workload">Bilanciamento Carico</option>
                          </select>
                        </FormControl>
                        <FormDescription>
                          Come vengono assegnati i trainer ai nuovi clienti
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salva Impostazioni
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
