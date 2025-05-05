
import { useState, useEffect } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("clients");
  const isMobile = useIsMobile();

  // Effect to handle mobile-specific behavior
  useEffect(() => {
    // We'll adjust the scroll position when tab changes on mobile
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, isMobile]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Trainer</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Trainer'}. Gestisci i tuoi clienti, schede e comunicazioni.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`${isMobile ? 'w-full flex overflow-x-auto py-2 px-1 bg-muted/40' : 'bg-muted/60'}`}>
          <TabsTrigger value="clients" className={`${isMobile ? 'flex-1 py-2 px-3' : ''}`}>
            <Users className="h-4 w-4 mr-2" />
            <span className={isMobile ? "text-xs" : ""}>I Miei Clienti</span>
          </TabsTrigger>
          <TabsTrigger value="workouts" className={`${isMobile ? 'flex-1 py-2 px-3' : ''}`}>
            <Dumbbell className="h-4 w-4 mr-2" />
            <span className={isMobile ? "text-xs" : ""}>Schede</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className={`${isMobile ? 'flex-1 py-2 px-3' : ''}`}>
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className={isMobile ? "text-xs" : ""}>Messaggi</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className={`${isMobile ? 'flex-1 py-2 px-3' : ''}`}>
            <FileText className="h-4 w-4 mr-2" />
            <span className={isMobile ? "text-xs" : ""}>Documenti</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-6">
          <AssignedClientsTable />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Clienti Primo Incontro
                </CardTitle>
                <CardDescription className="text-sm">
                  Clienti che devono ancora effettuare il primo incontro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MyClientsCard filter="first_meeting" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Clienti Follow-up
                </CardTitle>
                <CardDescription className="text-sm">
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Dumbbell className="h-5 w-5 text-primary" />
                Schede di Allenamento
              </CardTitle>
              <CardDescription className="text-sm">
                Gestisci e assegna schede di allenamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="text-base font-medium mb-2">Crea Schede</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crea schede personalizzate per i tuoi clienti
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/workout-templates">Crea Scheda</Link>
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="text-base font-medium mb-2">Assegna Schede</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assegna schede esistenti ai clienti
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/workout-templates">Assegna Scheda</Link>
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 mt-4">
                <h3 className="text-base font-medium mb-2">Schede Recenti</h3>
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Messaggi e Comunicazioni
              </CardTitle>
              <CardDescription className="text-sm">
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Documenti Personali
              </CardTitle>
              <CardDescription className="text-sm">
                Gestisci i tuoi documenti contrattuali e assicurativi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.id && <TrainerDocuments trainerId={user.id} trainerName={user?.user_metadata?.full_name || 'Trainer'} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t py-2 px-4 flex justify-around">
          <Button 
            variant={activeTab === "clients" ? "default" : "ghost"} 
            size="sm" 
            className="flex-col h-auto py-2" 
            onClick={() => setActiveTab("clients")}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs">Clienti</span>
          </Button>
          <Button 
            variant={activeTab === "workouts" ? "default" : "ghost"} 
            size="sm" 
            className="flex-col h-auto py-2" 
            onClick={() => setActiveTab("workouts")}
          >
            <Dumbbell className="h-5 w-5 mb-1" />
            <span className="text-xs">Schede</span>
          </Button>
          <Button 
            variant={activeTab === "messages" ? "default" : "ghost"} 
            size="sm" 
            className="flex-col h-auto py-2" 
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs">Messaggi</span>
          </Button>
          <Button 
            variant={activeTab === "documents" ? "default" : "ghost"} 
            size="sm" 
            className="flex-col h-auto py-2" 
            onClick={() => setActiveTab("documents")}
          >
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs">Documenti</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
