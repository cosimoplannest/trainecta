
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrainerDocuments } from "@/components/trainer/contracts/TrainerDocuments";
import { ProfileHeader } from "@/components/trainer/profile/ProfileHeader";
import { TrainerInfo } from "@/components/trainer/profile/TrainerInfo";
import { MetricsGrid } from "@/components/trainer/profile/MetricsGrid";
import { PerformanceStats } from "@/components/trainer/profile/PerformanceStats";
import { ClientData } from "@/components/clients/types/client-types";

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

type ClientsDataByCategory = {
  awaitingFirstMeeting: ClientData[];
  awaitingFollowup: ClientData[];
  personalPackageClients: ClientData[];
  customPlanClients: ClientData[];
};

const TrainerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState<TrainerData | null>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [metrics, setMetrics] = useState<TrainerMetrics>({
    awaitingFirstMeeting: 0,
    awaitingFollowup: 0,
    personalPackageClients: 0,
    customPlanClients: 0,
  });
  const [clientsData, setClientsData] = useState<ClientsDataByCategory>({
    awaitingFirstMeeting: [],
    awaitingFollowup: [],
    personalPackageClients: [],
    customPlanClients: [],
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
            .select(`
              *,
              users(full_name)
            `)
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
        
        // Filter clients into categories
        const awaitingFirstMeeting = clients.filter((c: any) => !c.first_meeting_completed);
        const awaitingFollowup = clients.filter((c: any) => {
          const needsFollowup = c.next_confirmation_due && new Date(c.next_confirmation_due) <= new Date();
          return needsFollowup;
        });
        const personalPackageClients = clients.filter((c: any) => c.subscription_type === 'personal');
        const customPlanClients = clients.filter((c: any) => c.subscription_type === 'custom_plan');
        
        setMetrics({
          awaitingFirstMeeting: awaitingFirstMeeting.length,
          awaitingFollowup: awaitingFollowup.length,
          personalPackageClients: personalPackageClients.length,
          customPlanClients: customPlanClients.length,
        });
        
        setClientsData({
          awaitingFirstMeeting,
          awaitingFollowup,
          personalPackageClients,
          customPlanClients,
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
      <ProfileHeader fullName={trainer.full_name} email={trainer.email} />
      
      <div className="grid gap-6">
        <TrainerInfo trainer={trainer} />
        <MetricsGrid metrics={metrics} clientsData={clientsData} />
        
        {performanceData && <PerformanceStats performanceData={performanceData} />}
        
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
