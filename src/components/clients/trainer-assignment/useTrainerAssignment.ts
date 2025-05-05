
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface UseTrainerAssignmentProps {
  clientId: string;
  currentTrainerId?: string | null;
  onAssigned: () => void;
}

export const useTrainerAssignment = ({ clientId, currentTrainerId, onAssigned }: UseTrainerAssignmentProps) => {
  const [trainers, setTrainers] = useState<{ id: string; name: string }[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<string>(currentTrainerId || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [gymId, setGymId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch the user's gym_id when the component mounts
    const fetchUserGymId = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("users")
          .select("gym_id")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setGymId(data.gym_id);
      } catch (error) {
        console.error("Error fetching user gym ID:", error);
        toast({
          title: "Errore",
          description: "Impossibile recuperare l'ID della palestra",
          variant: "destructive",
        });
      }
    };

    fetchUserGymId();
  }, [user, toast]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("role", "trainer");

        if (error) throw error;
        setTrainers(data.map(trainer => ({
          id: trainer.id,
          name: trainer.full_name
        })));
      } catch (error) {
        console.error("Error fetching trainers:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare l'elenco dei trainer",
          variant: "destructive",
        });
      }
    };

    fetchTrainers();
  }, [toast]);

  const handleAssign = async () => {
    if (!selectedTrainer) {
      toast({
        title: "Errore",
        description: "Seleziona un trainer da assegnare",
        variant: "destructive",
      });
      return;
    }

    if (!gymId) {
      toast({
        title: "Errore",
        description: "ID palestra non disponibile. Riprova più tardi.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update client with assigned trainer
      const { error: updateError } = await supabase
        .from("clients")
        .update({ assigned_to: selectedTrainer })
        .eq("id", clientId);

      if (updateError) throw updateError;

      // Log activity
      const { error: activityError } = await supabase.from("activity_logs").insert({
        action: "trainer_assigned",
        target_id: clientId,
        target_type: "client",
        user_id: user?.id,
        notes: notes || `Cliente assegnato al trainer ${selectedTrainer}`,
        gym_id: gymId,
      });

      if (activityError) {
        console.error("Activity log error:", activityError);
        // Continue even if activity logging fails
        toast({
          title: "Avviso",
          description: "Trainer assegnato, ma si è verificato un errore nel registrare l'attività",
        });
      } else {
        toast({
          title: "Successo",
          description: "Cliente assegnato al trainer con successo",
        });
      }
      
      onAssigned();
      return true;
    } catch (error: any) {
      console.error("Error assigning trainer:", error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile assegnare il trainer al cliente",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    trainers,
    selectedTrainer,
    setSelectedTrainer,
    notes,
    setNotes,
    loading,
    handleAssign
  };
};
