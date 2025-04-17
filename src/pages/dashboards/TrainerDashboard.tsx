
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Dumbbell, MessageSquare, FileText, ArrowUpRight, UserPlus, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AssignedClientsTable } from "@/components/trainer/clients/AssignedClientsTable";
import { SendMessageForm } from "@/components/trainer/messages/SendMessageForm";
import { MyClientsCard } from "@/components/followups";
import { TrainerDocuments } from "@/components/trainer/contracts";

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("clients");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Trainer</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Trainer'}. Gestisci i tuoi clienti, schede e comunicazioni.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="clients">
            <Users className="h-4 w-4 mr-2" />
            I Miei Clienti
          </TabsTrigger>
          <TabsTrigger value="workouts">
            <Dumbbell className="h-4 w-4 mr-2" />
            Schede Allenamento
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messaggi
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documenti
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-6">
          <AssignedClientsTable />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Clienti Primo Incontro
                </CardTitle>
                <CardDescription>
                  Clienti che devono ancora effettuare il primo incontro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MyClientsCard filter="first_meeting" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Clienti Follow-up
                </CardTitle>
                <CardDescription>
                  Clienti che necessitano di un follow-up
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MyClientsCard filter="followup" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="workouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Schede di Allenamento
              </CardTitle>
              <CardDescription>
                Gestisci e assegna schede di allenamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Crea Schede</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crea schede personalizzate per i tuoi clienti
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/workout-templates">Crea Scheda</Link>
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Assegna Schede</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assegna schede esistenti ai clienti
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/workout-templates">Assegna Scheda</Link>
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Schede Recenti</h3>
                <p className="text-sm text-muted-foreground">
                  Le tue schede create di recente appariranno qui
                </p>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/workout-templates">Visualizza Tutte le Schede</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Messaggi e Comunicazioni
              </CardTitle>
              <CardDescription>
                Gestisci le comunicazioni con i tuoi clienti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SendMessageForm />
              
              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/communications">
                    Vai a Comunicazioni
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documenti Personali
              </CardTitle>
              <CardDescription>
                Gestisci i tuoi documenti contrattuali e assicurativi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.id && <TrainerDocuments trainerId={user.id} trainerName={user?.user_metadata?.full_name || 'Trainer'} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerDashboard;
