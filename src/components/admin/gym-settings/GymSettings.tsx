
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGymSettingsForm } from "./use-gym-settings";
import { GeneralSettings } from "./GeneralSettings";
import { ContactSettings } from "./ContactSettings";
import { OperationalSettings } from "./OperationalSettings";
import { AdvancedSettings } from "./AdvancedSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function GymSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxAttempts = 3;
  
  const {
    form,
    gymId,
    gymSettingsId,
    fetchSettings,
    saveSettings,
    fetchError,
    saveError
  } = useGymSettingsForm();

  useEffect(() => {
    const loadSettings = async () => {
      if (loadAttempts >= maxAttempts) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        await fetchSettings(user);
      } catch (error) {
        console.error("Error in loadSettings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user, fetchSettings, loadAttempts]);

  const handleRetry = () => {
    setLoadAttempts(prev => prev + 1);
  };

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
        description: saveError || "Non è stato possibile salvare le impostazioni della palestra",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Caricamento impostazioni...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Errore di caricamento</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
        <Button onClick={handleRetry} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Riprovo...
            </>
          ) : (
            "Riprova"
          )}
        </Button>
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
