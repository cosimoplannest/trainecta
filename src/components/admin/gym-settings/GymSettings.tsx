
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
  const {
    form,
    fetchSettings,
    saveSettings,
    fetchError,
    isLoading,
    isInitialized,
    retryFetchSettings
  } = useGymSettingsForm();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Only fetch settings once
    if (user && !isInitialized) {
      console.log("Fetching gym settings...");
      fetchSettings(user);
    }
  }, [user, fetchSettings, isInitialized]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await saveSettings(data);
    } catch (error) {
      console.error("Error saving gym settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
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
        <Button 
          onClick={() => retryFetchSettings(user)} 
          disabled={isLoading}
        >
          {isLoading ? (
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
