
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainerDocuments } from "@/components/trainer/contracts/TrainerDocuments";
import { PerformanceChartCard } from "@/components/performance/components/PerformanceChartCard";

type TrainerData = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  registration_date: string;
};

const TrainerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState<TrainerData | null>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch trainer info
        const { data: trainerData, error: trainerError } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

        if (trainerError) throw trainerError;

        // Fetch performance data specific to this trainer
        const { data: followupsData, error: followupsError } = await supabase
          .from("client_followups")
          .select(`
            trainer_id,
            purchase_confirmed
          `)
          .eq('trainer_id', id);
          
        if (followupsError) throw followupsError;
        
        // Calculate performance metrics
        const total = followupsData.length;
        const conversions = followupsData.filter((f: any) => f.purchase_confirmed).length;
        const rate = total > 0 ? Math.round((conversions / total) * 100) : 0;
        
        const performanceMetrics = {
          name: trainerData.full_name,
          rate,
          total,
          conversions
        };

        setTrainer(trainerData as TrainerData);
        setPerformanceData([performanceMetrics]);

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

        {performanceData && (
          <Card>
            <CardHeader>
              <CardTitle>Performance del Trainer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <PerformanceChartCard trainerData={performanceData} />
                
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
        
        <TrainerDocuments trainerId={id!} trainerName={trainer.full_name} />
      </div>
    </div>
  );
};

export default TrainerProfile;
