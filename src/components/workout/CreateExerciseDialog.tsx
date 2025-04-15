
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Exercise } from "@/types/workout";

interface CreateExerciseDialogProps {
  onExerciseAdded: (exercise: Exercise) => void;
  gymId?: string;
}

export function CreateExerciseDialog({ onExerciseAdded, gymId }: CreateExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<Partial<Exercise>>({
    name: "",
    description: "",
    video_url: ""
  });

  const isValidUrl = (url: string) => {
    if (!url) return true; // Empty URLs are considered valid (optional field)
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleCreateExercise = async () => {
    if (!exercise.name) {
      toast.error("Nome esercizio richiesto");
      return;
    }

    if (exercise.video_url && !isValidUrl(exercise.video_url)) {
      toast.error("URL del video non valido");
      return;
    }

    if (!gymId) {
      toast.error("Errore: ID palestra non disponibile");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("exercises")
        .insert({
          name: exercise.name,
          description: exercise.description,
          video_url: exercise.video_url,
          gym_id: gymId, // Use the gym_id passed as prop
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Esercizio creato con successo");
      onExerciseAdded(data);
      setOpen(false);
      setExercise({ name: "", description: "", video_url: "" });
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error("Errore durante la creazione dell'esercizio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuovo Esercizio</DialogTitle>
          <DialogDescription>
            Crea un nuovo esercizio da aggiungere al catalogo
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Esercizio</Label>
            <Input 
              id="name" 
              value={exercise.name}
              onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
              placeholder="es. Leg Press"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea 
              id="description" 
              value={exercise.description}
              onChange={(e) => setExercise({ ...exercise, description: e.target.value })}
              placeholder="Descrizione dell'esercizio..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="video_url" className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span>URL Video Tutorial</span>
            </Label>
            <Input 
              id="video_url" 
              value={exercise.video_url}
              onChange={(e) => setExercise({ ...exercise, video_url: e.target.value })}
              placeholder="es. https://youtube.com/watch?v=..."
              className={exercise.video_url && !isValidUrl(exercise.video_url) ? "border-red-500" : ""}
            />
            {exercise.video_url && !isValidUrl(exercise.video_url) && (
              <p className="text-xs text-red-500">URL non valido</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={handleCreateExercise} disabled={loading}>
            {loading ? "Creazione..." : "Crea Esercizio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
