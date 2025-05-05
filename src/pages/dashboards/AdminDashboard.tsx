
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Shield, 
  Settings as SettingsIcon, 
  ArrowUpRight, 
  LineChart, 
  Key, 
  UserCog,
  Dumbbell,
  UserRound,
  Ticket,
  Bell,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { PendingApprovals } from "@/components/admin/PendingApprovals";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [hasPendingApprovals, setHasPendingApprovals] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if there are any pending approvals
  useEffect(() => {
    const checkPendingApprovals = async () => {
      if (!user) return;
      
      try {
        const { data, error, count } = await supabase
          .from("users")
          .select("id", { count: 'exact' })
          .eq("status", "pending_approval")
          .eq("gym_id", user.user_metadata?.gym_id || "")
          .limit(1);
          
        if (error) throw error;
        setHasPendingApprovals(count !== null && count > 0);
      } catch (error) {
        console.error("Error checking pending approvals:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkPendingApprovals();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Amministratore</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Amministratore'}. Gestisci la tua palestra.
        </p>
      </div>
      
      {hasPendingApprovals && (
        <div className="mb-6">
          <PendingApprovals />
        </div>
      )}
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="settings">Impostazioni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clienti</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gestione Clienti</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Visualizza e gestisci tutti i clienti della palestra
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/client-management" className="flex items-center justify-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statistiche</CardTitle>
                <LineChart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Report Palestra</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Statistiche e report sulla tua palestra
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/statistics" className="flex items-center justify-center">
                    Visualizza <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monitoraggio</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Tracciamento</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Monitoraggio clienti e follow-up
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/tracking" className="flex items-center justify-center">
                    Traccia <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Allenamento</CardTitle>
                <Dumbbell className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Schede Allenamento</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Gestisci le schede di allenamento
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/workout-templates" className="flex items-center justify-center">
                    Modifica <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comunicazione</CardTitle>
                <Bell className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Messaggi</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Comunicazioni con staff e clienti
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/communications" className="flex items-center justify-center">
                    Invia <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifiche</CardTitle>
                <Bell className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gestione Notifiche</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Gestisci tutte le notifiche del sistema
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/notifications" className="flex items-center justify-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-1">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Configurazione</CardTitle>
                <SettingsIcon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Impostazioni</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Configura le impostazioni della palestra
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin-settings" className="flex items-center justify-center">
                    Configura <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trainer</CardTitle>
                <Dumbbell className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gestione Trainer</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Visualizza e gestisci i trainer
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin-settings?tab=user-management&role=trainers" className="flex items-center justify-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operatori</CardTitle>
                <UserCog className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gestione Operatori</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Gestisci gli operatori della reception
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin-settings?tab=user-management&role=operators" className="flex items-center justify-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assistenti</CardTitle>
                <UserRound className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gestione Assistenti</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Visualizza e gestisci gli assistenti
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin-settings?tab=user-management&role=assistants" className="flex items-center justify-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Istruttori</CardTitle>
                <Ticket className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gestione Istruttori</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Gestisci gli istruttori dei corsi
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin-settings?tab=user-management&role=instructors" className="flex items-center justify-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Codici Registrazione</CardTitle>
                <Key className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Inviti Staff</div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Gestisci i codici di registrazione per lo staff
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/admin-settings?tab=registration-codes" className="flex items-center justify-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" /> Impostazioni Generali
                </CardTitle>
                <CardDescription>
                  Modifica le impostazioni principali della palestra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link to="/admin-settings?tab=gym-settings">Vai alle Impostazioni</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Gestione Ruoli Utente
                </CardTitle>
                <CardDescription>
                  Gestisci i permessi e i ruoli degli utenti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link to="/admin-settings?tab=user-roles">Gestisci Ruoli</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
