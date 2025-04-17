
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GymSettings } from "@/components/admin/gym-settings";
import { UserRoleManagement } from "@/components/admin/UserRoleManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { RegistrationCodes } from "@/components/admin/registration-codes";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Navigate, useLocation } from "react-router-dom";
import { Settings, Users, Shield, Key } from "lucide-react";

const AdminSettings = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'gym-settings';
  const selectedRole = searchParams.get('role');

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
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="gym-settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Impostazioni Palestra
          </TabsTrigger>
          <TabsTrigger value="user-management" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Gestione Utenti
          </TabsTrigger>
          <TabsTrigger value="user-roles" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Gestione Ruoli
          </TabsTrigger>
          <TabsTrigger value="registration-codes" className="flex items-center gap-1">
            <Key className="h-4 w-4" />
            Codici Registrazione
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gym-settings">
          <GymSettings />
        </TabsContent>
        
        <TabsContent value="user-management">
          <UserManagement initialRole={selectedRole} />
        </TabsContent>
        
        <TabsContent value="user-roles">
          <UserRoleManagement />
        </TabsContent>
        
        <TabsContent value="registration-codes">
          <RegistrationCodes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
