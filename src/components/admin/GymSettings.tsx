
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
import { Loader2, Save, Settings } from "lucide-react";

type FormValues = {
  name: string;
  max_trials_per_client: number;
  enable_auto_followup: boolean;
  days_to_first_followup: number;
  days_to_active_confirmation: number;
  template_sent_by: "trainer" | "system" | "both";
  template_viewable_by_client: boolean;
  allow_template_duplication: boolean;
  default_trainer_assignment_logic: string;
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
      max_trials_per_client: 1,
      enable_auto_followup: true,
      days_to_first_followup: 7,
      days_to_active_confirmation: 30,
      template_sent_by: "both",
      template_viewable_by_client: true,
      allow_template_duplication: true,
      default_trainer_assignment_logic: "manual",
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
        // Fetch gym name
        const { data: gymData, error: gymError } = await supabase
          .from("gyms")
          .select("name")
          .eq("id", userGymId)
          .single();

        if (gymError) throw gymError;

        // Fetch gym settings
        const { data: settingsData, error: settingsError } = await supabase
          .from("gym_settings")
          .select("*")
          .eq("gym_id", userGymId)
          .single();

        if (settingsError && settingsError.code !== "PGRST116") {
          throw settingsError;
        }

        if (settingsData) {
          setGymSettingsId(settingsData.id);
          form.reset({
            name: gymData?.name || "",
            max_trials_per_client: settingsData.max_trials_per_client || 1,
            enable_auto_followup: settingsData.enable_auto_followup || true,
            days_to_first_followup: settingsData.days_to_first_followup || 7,
            days_to_active_confirmation: settingsData.days_to_active_confirmation || 30,
            template_sent_by: settingsData.template_sent_by || "both",
            template_viewable_by_client: settingsData.template_viewable_by_client || true,
            allow_template_duplication: settingsData.allow_template_duplication || true,
            default_trainer_assignment_logic: settingsData.default_trainer_assignment_logic || "manual",
          });
        } else {
          // If no settings exist, use defaults with gym name
          form.reset({
            name: gymData?.name || "",
            max_trials_per_client: 1,
            enable_auto_followup: true,
            days_to_first_followup: 7,
            days_to_active_confirmation: 30,
            template_sent_by: "both",
            template_viewable_by_client: true,
            allow_template_duplication: true,
            default_trainer_assignment_logic: "manual",
          });
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
      // Update gym name
      const { error: gymError } = await supabase
        .from("gyms")
        .update({ name: data.name })
        .eq("id", gymId);

      if (gymError) throw gymError;

      // Update or insert gym settings
      const settingsData = {
        gym_id: gymId,
        max_trials_per_client: data.max_trials_per_client,
        enable_auto_followup: data.enable_auto_followup,
        days_to_first_followup: data.days_to_first_followup,
        days_to_active_confirmation: data.days_to_active_confirmation,
        template_sent_by: data.template_sent_by,
        template_viewable_by_client: data.template_viewable_by_client,
        allow_template_duplication: data.allow_template_duplication,
        default_trainer_assignment_logic: data.default_trainer_assignment_logic,
      };

      let settingsError;
      if (gymSettingsId) {
        // Update existing settings
        const { error } = await supabase
          .from("gym_settings")
          .update(settingsData)
          .eq("id", gymSettingsId);
        
        settingsError = error;
      } else {
        // Insert new settings
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
                        <FormLabel>Numero Massimo di Prove Gratuite</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Numero massimo di prove gratuite che un cliente può fare
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
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="trainer">Solo Trainer</option>
                            <option value="system">Solo Sistema</option>
                            <option value="both">Entrambi</option>
                          </select>
                        </FormControl>
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
