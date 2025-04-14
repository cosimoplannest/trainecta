
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Settings as SettingsIcon, ArrowUpRight, LineChart, Key } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Amministratore</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Amministratore'}. Gestisci la tua palestra.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="settings">Impostazioni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clienti Totali</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gestione Clienti</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza e gestisci tutti i clienti della palestra
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/client-management" className="flex items-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statistiche</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Report Palestra</div>
                <p className="text-xs text-muted-foreground">
                  Statistiche e report sulla tua palestra
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/statistics" className="flex items-center">
                    Visualizza <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Configurazione</CardTitle>
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Impostazioni</div>
                <p className="text-xs text-muted-foreground">
                  Configura le impostazioni della palestra
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/admin-settings" className="flex items-center">
                    Configura <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" /> Gestione Staff
              </CardTitle>
              <CardDescription>
                Gestisci il personale della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full justify-start" asChild>
                    <Link to="/admin-settings?tab=registration-codes">
                      <Key className="mr-2 h-4 w-4" />
                      Codici di Registrazione
                    </Link>
                  </Button>
                  
                  <Button className="w-full justify-start" asChild>
                    <Link to="/admin-settings?tab=user-management">
                      <Users className="mr-2 h-4 w-4" />
                      Gestione Utenti
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Palestra</CardTitle>
              <CardDescription>
                Configura le impostazioni generali della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/admin-settings">Vai alle Impostazioni</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
