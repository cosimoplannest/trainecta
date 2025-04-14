
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Dumbbell, LineChart, ArrowUpRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const TrainerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Trainer</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Trainer'}. Gestisci i tuoi clienti e schede.
        </p>
      </div>
      
      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="clients">Clienti</TabsTrigger>
          <TabsTrigger value="workouts">Schede</TabsTrigger>
          <TabsTrigger value="tracking">Monitoraggio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clienti Assegnati</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">I Tuoi Clienti</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza e gestisci i clienti a te assegnati
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
                <CardTitle className="text-sm font-medium">Follow-Up</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Follow-Up Clienti</div>
                <p className="text-xs text-muted-foreground">
                  Gestisci i follow-up per i tuoi clienti
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/communications" className="flex items-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Le Tue Statistiche</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza le tue performance e conversioni
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/statistics" className="flex items-center">
                    Visualizza <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="workouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-6 w-6" /> Schede di Allenamento
              </CardTitle>
              <CardDescription>
                Crea e gestisci le schede di allenamento per i tuoi clienti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/workout-templates">Gestisci Schede</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Monitoraggio Clienti</CardTitle>
              <CardDescription>
                Monitora i progressi e i risultati dei tuoi clienti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/tracking">Vai al Monitoraggio</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerDashboard;
