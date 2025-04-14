
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface AssignTrainerProps {
  clientId: string;
  currentTrainerId?: string | null;
  onAssigned: () => void;
}

export const AssignTrainer = ({ clientId, currentTrainerId, onAssigned }: AssignTrainerProps) => {
  const [open, setOpen] = useState(false);
  const [trainers, setTrainers] = useState<{ id: string; name: string }[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<string>(currentTrainerId || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

    setLoading(true);
    try {
      // Update client with assigned trainer
      const { error: updateError } = await supabase
        .from("clients")
        .update({ assigned_to: selectedTrainer })
        .eq("id", clientId);

      if (updateError) throw updateError;

      // Create follow-up record
      const { error: followupError } = await supabase
        .from("client_followups")
        .insert({
          client_id: clientId,
          trainer_id: selectedTrainer,
          type: "in_app",
          notes: notes || "Cliente assegnato al trainer",
        });

      if (followupError) throw followupError;

      // Log activity
      await supabase.from("activity_logs").insert({
        action: "trainer_assigned",
        target_id: clientId,
        target_type: "client",
        user_id: selectedTrainer,
        gym_id: "11111111-1111-1111-1111-111111111111", // Hardcoded for now
        notes: `Cliente assegnato al trainer ${selectedTrainer}`,
      });

      toast({
        title: "Successo",
        description: "Cliente assegnato al trainer con successo",
      });
      
      setOpen(false);
      onAssigned();
    } catch (error) {
      console.error("Error assigning trainer:", error);
      toast({
        title: "Errore",
        description: "Impossibile assegnare il trainer al cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {currentTrainerId ? "Cambia Trainer" : "Assegna Trainer"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assegna Trainer al Cliente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="trainer">Seleziona Trainer</Label>
            <Select
              value={selectedTrainer}
              onValueChange={setSelectedTrainer}
            >
              <SelectTrigger id="trainer">
                <SelectValue placeholder="Seleziona un trainer" />
              </SelectTrigger>
              <SelectContent>
                {trainers.map((trainer) => (
                  <SelectItem key={trainer.id} value={trainer.id}>
                    {trainer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Note</Label>
            <Textarea
              id="notes"
              placeholder="Aggiungi note sull'assegnazione"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={handleAssign} disabled={loading}>
            {loading ? "Assegnazione..." : "Assegna Trainer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
