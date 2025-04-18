
import { useEffect, useState } from "react";
import { GymSettings } from "@/components/admin/gym-settings";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Loader2, AlertTriangle, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowVisualization } from "@/components/admin/gym-settings/WorkflowVisualization";
import { useGymSettingsForm } from "@/components/admin/gym-settings/use-gym-settings";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { form } = useGymSettingsForm();
  const formValues = form.watch();

  useEffect(() => {
    // Check if user is admin only once when component mounts or user changes
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (error) throw error;
        setIsAdmin(data);
      } catch (error) {
        console.error("Error checking admin role:", error);
        toast({
          title: "Error",
          description: "Unable to verify your permissions",
          variant: "destructive",
        });
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not an admin, redirect to dashboard
  if (isAdmin === false) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Impostazioni Palestra</h1>
      
      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Gestione Flussi Cliente
            </CardTitle>
            <CardDescription>
              Questa sezione consente di gestire i flussi automatici per il monitoraggio dei clienti dopo il primo incontro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Configura attentamente i parametri per ottimizzare i flussi di vendita e follow-up dei clienti.
                I flussi automatici si attiveranno in base all'esito registrato dai trainer dopo il primo incontro.
              </AlertDescription>
            </Alert>

            <div className="text-sm text-muted-foreground mt-2">
              <p>Configura tutti i parametri nella sezione "Impostazioni Operative" qui sotto per personalizzare i flussi post-primo incontro.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <div>
          <GymSettings />
        </div>
        <div className="space-y-6">
          <WorkflowVisualization settings={formValues} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
