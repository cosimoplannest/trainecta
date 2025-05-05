
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationsList } from "@/components/notifications/admin/NotificationsList";
import { SendNotificationForm } from "@/components/notifications/admin/SendNotificationForm";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

const NotificationManagement = () => {
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
      <h1 className="mb-6 text-3xl font-bold">Gestione Notifiche</h1>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Visualizza Notifiche</TabsTrigger>
          <TabsTrigger value="send">Invia Notifiche</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <NotificationsList />
        </TabsContent>
        
        <TabsContent value="send">
          <SendNotificationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationManagement;
