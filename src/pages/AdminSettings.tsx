
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GymSettings } from "@/components/admin/GymSettings";
import { UserRoleManagement } from "@/components/admin/UserRoleManagement";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

const AdminSettings = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          title: "Errore",
          description: "Non è stato possibile verificare i tuoi permessi",
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
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isAdmin === false) {
    toast({
      title: "Accesso negato",
      description: "Non hai i permessi per accedere a questa pagina",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Configurazioni Admin</h1>
      
      <Tabs defaultValue="gym-settings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="gym-settings">Impostazioni Palestra</TabsTrigger>
          <TabsTrigger value="user-roles">Gestione Ruoli Utente</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gym-settings">
          <GymSettings />
        </TabsContent>
        
        <TabsContent value="user-roles">
          <UserRoleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
