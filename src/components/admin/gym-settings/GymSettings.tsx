
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGymSettingsForm } from "./use-gym-settings";
import { GeneralSettings } from "./GeneralSettings";
import { ContactSettings } from "./ContactSettings";
import { OperationalSettings } from "./OperationalSettings";
import { AdvancedSettings } from "./AdvancedSettings";

export function GymSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const {
    form,
    gymId,
    gymSettingsId,
    fetchSettings,
    saveSettings
  } = useGymSettingsForm();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      await fetchSettings(user);
      setLoading(false);
    };

    loadSettings();
  }, [user, fetchSettings]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await saveSettings(data);
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TabsContent value="general">
            <GeneralSettings form={form} />
          </TabsContent>

          <TabsContent value="contact">
            <ContactSettings form={form} />
          </TabsContent>

          <TabsContent value="operational">
            <OperationalSettings form={form} />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedSettings form={form} />
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
      </Tabs>
    </div>
  );
}
