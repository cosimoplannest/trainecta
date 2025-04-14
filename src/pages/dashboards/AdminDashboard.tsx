
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Users, Shield, Settings as SettingsIcon, Dumbbell, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserRoleManagement } from "@/components/admin/UserRoleManagement";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Amministratore</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Admin'}. Gestisci la tua palestra da qui.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="general">Generale</TabsTrigger>
          <TabsTrigger value="users">Utenti</TabsTrigger>
          <TabsTrigger value="settings">Impostazioni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gestione Schede</CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Schede Allenamento</div>
                <p className="text-xs text-muted-foreground">
                  Crea e gestisci le schede di allenamento per i clienti
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/workout-templates" className="flex items-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gestione Utenti</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Utenti Staff</div>
                <p className="text-xs text-muted-foreground">
                  Gestisci gli utenti del tuo staff e le loro autorizzazioni
                </p>
                <Button variant="link" className="mt-2 p-0">
                  <Link to="#users" className="flex items-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ruoli e Permessi</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gestione Ruoli</div>
                <p className="text-xs text-muted-foreground">
                  Assegna e modifica i ruoli del tuo staff
                </p>
                <Button variant="link" className="mt-2 p-0">
                  <Link to="#users" className="flex items-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impostazioni</CardTitle>
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Configurazione</div>
                <p className="text-xs text-muted-foreground">
                  Configura le impostazioni della tua palestra
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/admin-settings" className="flex items-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Codici di Registrazione</CardTitle>
                <CardDescription>
                  Crea e gestisci i codici di registrazione per il tuo staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4">
                  Funzionalità di generazione codici in arrivo...
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-6 w-6" /> Gestione Utenti e Ruoli
              </CardTitle>
              <CardDescription>
                Gestisci gli utenti della tua palestra e assegna i ruoli appropriati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserRoleManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Amministratore</CardTitle>
              <CardDescription>
                Configura le impostazioni generali della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin-settings">Vai alle impostazioni complete</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
