
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Calendar, ArrowUpRight, ClipboardList, LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const OperatorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Operatore</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Operatore'}. Gestisci i clienti e le comunicazioni.
        </p>
      </div>
      
      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="clients">Clienti</TabsTrigger>
          <TabsTrigger value="communications">Comunicazioni</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gestione Clienti</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Anagrafica Clienti</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza e modifica i dati dei clienti
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
                <CardTitle className="text-sm font-medium">Monitoraggio Clienti</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Primo Incontro & Follow-Up</div>
                <p className="text-xs text-muted-foreground">
                  Monitora i clienti prioritari
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/tracking" className="flex items-center">
                    Monitora <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prove Gratuite</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Nuove Prove</div>
                <p className="text-xs text-muted-foreground">
                  Gestisci le prove gratuite e i potenziali clienti
                </p>
                <Button variant="link" className="mt-2 p-0" asChild>
                  <Link to="/client-management?tab=trials" className="flex items-center">
                    Gestisci <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statistiche</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Report Clienti</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza statistiche e report sui clienti
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
        
        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" /> Comunicazioni
              </CardTitle>
              <CardDescription>
                Gestisci le comunicazioni con i clienti e lo staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/communications">Vai alle comunicazioni</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="follow-ups">
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up Clienti</CardTitle>
              <CardDescription>
                Gestisci i follow-up per i clienti in prova e quelli esistenti
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-center">
                Accedi alla pagina di monitoraggio clienti per gestire i follow-up
              </p>
              <Button asChild>
                <Link to="/tracking">Vai al monitoraggio clienti</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperatorDashboard;
