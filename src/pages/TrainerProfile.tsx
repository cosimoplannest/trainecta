
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainerDocuments } from "@/components/trainer/contracts/TrainerDocuments";

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

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setTrainer(data as TrainerData);
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
        
        <TrainerDocuments trainerId={id!} trainerName={trainer.full_name} />
      </div>
    </div>
  );
};

export default TrainerProfile;
