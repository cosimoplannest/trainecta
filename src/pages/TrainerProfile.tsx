import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft, User, Calendar, UserCheck, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainerDocuments } from "@/components/trainer/contracts/TrainerDocuments";
import { PerformanceChart } from "@/components/PerformanceChart";

type TrainerData = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  registration_date: string;
};

type TrainerMetrics = {
  awaitingFirstMeeting: number;
  awaitingFollowup: number;
  personalPackageClients: number;
  customPlanClients: number;
};

const TrainerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState<TrainerData | null>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [metrics, setMetrics] = useState<TrainerMetrics>({
    awaitingFirstMeeting: 0,
    awaitingFollowup: 0,
    personalPackageClients: 0,
    customPlanClients: 0,
  });

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const [trainerResult, followupsResult, clientsResult] = await Promise.all([
          supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single(),
            
          supabase
            .from("client_followups")
            .select("trainer_id, purchase_confirmed")
            .eq("trainer_id", id),
            
          supabase
            .from("clients")
            .select("*")
            .eq("assigned_to", id)
        ]);

        if (trainerResult.error) throw trainerResult.error;
        if (followupsResult.error) throw followupsResult.error;
        if (clientsResult.error) throw clientsResult.error;

        const total = followupsResult.data.length;
        const conversions = followupsResult.data.filter((f: any) => f.purchase_confirmed).length;
        const rate = total > 0 ? Math.round((conversions / total) * 100) : 0;

        setTrainer(trainerResult.data as TrainerData);
        setPerformanceData([{
          name: trainerResult.data.full_name,
          rate,
          total,
          conversions
        }]);

        const clients = clientsResult.data;
        setMetrics({
          awaitingFirstMeeting: clients.filter((c: any) => !c.first_meeting_completed).length,
          awaitingFollowup: clients.filter((c: any) => {
            const needsFollowup = c.next_confirmation_due && new Date(c.next_confirmation_due) <= new Date();
            return needsFollowup;
          }).length,
          personalPackageClients: clients.filter((c: any) => c.subscription_type === 'personal').length,
          customPlanClients: clients.filter((c: any) => c.subscription_type === 'custom_plan').length,
        });

      } catch (error: any) {
        console.error("Error fetching trainer data:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati del trainer",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Trainer non trovato</h2>
        <p className="text-muted-foreground mt-2">
          Il trainer richiesto non esiste o è stato rimosso
        </p>
        <Button 
          onClick={() => navigate("/admin-settings?tab=user-management&role=trainers")}
          className="mt-4"
        >
          Torna alla lista trainer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/admin-settings?tab=user-management&role=trainers")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {trainer.full_name}
          </h2>
          <p className="text-muted-foreground">
            Trainer - {trainer.email}
          </p>
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Personali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Stato</p>
                <p className="text-sm">
                  {trainer.status === 'active' ? 'Attivo' : 'Inattivo'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Ruolo</p>
                <p className="text-sm capitalize">{trainer.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{trainer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data di registrazione</p>
                <p className="text-sm">
                  {new Date(trainer.registration_date).toLocaleDateString('it-IT')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                In attesa primo incontro
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.awaitingFirstMeeting}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                In attesa follow-up
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.awaitingFollowup}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clienti Personal
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.personalPackageClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clienti Scheda Personalizzata
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.customPlanClients}</div>
            </CardContent>
          </Card>
        </div>

        {performanceData && (
          <Card>
            <CardHeader>
              <CardTitle>Performance del Trainer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-80">
                  <PerformanceChart trainerData={performanceData} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Totale Follow-up</p>
                    <p className="text-2xl font-bold">{performanceData[0].total}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Conversioni</p>
                    <p className="text-2xl font-bold">{performanceData[0].conversions}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Tasso di Conversione</p>
                    <p className="text-2xl font-bold">{performanceData[0].rate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <TrainerDocuments 
          trainerId={id!} 
          trainerName={trainer.full_name}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default TrainerProfile;
