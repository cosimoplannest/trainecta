
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const AssistantDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Assistente</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Assistente'}. Gestisci i turni in sala.
        </p>
      </div>
      
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="schedule">Turni</TabsTrigger>
          <TabsTrigger value="members">Membri</TabsTrigger>
          <TabsTrigger value="unavailability">Indisponibilità</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turni in Sala</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Turni Settimanali</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza e gestisci i tuoi turni in sala
                </p>
                <Button variant="link" className="mt-2 p-0" disabled>
                  <span className="flex items-center">
                    Visualizza <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calendario</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Pianificazione</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza il calendario dei turni in sala
                </p>
                <Button variant="link" className="mt-2 p-0" disabled>
                  <span className="flex items-center">
                    Visualizza <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clienti in Sala</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Monitoraggio</div>
                <p className="text-xs text-muted-foreground">
                  Monitora i clienti presenti in sala
                </p>
                <Button variant="link" className="mt-2 p-0" disabled>
                  <span className="flex items-center">
                    Monitora <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" /> Gestione Membri
              </CardTitle>
              <CardDescription>
                Visualizza i clienti e le loro schede
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-4 text-center">
                Funzionalità di gestione membri in arrivo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unavailability">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Indisponibilità</CardTitle>
              <CardDescription>
                Dichiara periodi di indisponibilità o malattia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/communications">Gestisci Indisponibilità</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssistantDashboard;
