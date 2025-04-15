
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TemplateExercise, TemplateExerciseWithNestedExercise } from "@/types/workout";

/**
 * Adds an exercise to a template
 */
export const addExerciseToTemplate = async (
  templateId: string,
  newExercise: Partial<TemplateExercise>,
  currentExercises: TemplateExerciseWithNestedExercise[]
) => {
  if (!templateId || !newExercise.exercise_id) {
    toast.error("Dati esercizio incompleti");
    return null;
  }
  
  try {
    // Ensure we have a valid order index
    const orderIndex = newExercise.order_index || 
      (currentExercises.length > 0 
        ? Math.max(...currentExercises.map(e => e.order_index)) + 1 
        : 1);
    
    const { data, error } = await supabase
      .from("template_exercises")
      .insert({
        template_id: templateId,
        exercise_id: newExercise.exercise_id,
        sets: newExercise.sets || 3,
        reps: newExercise.reps || "12",
        order_index: orderIndex,
        notes: newExercise.notes
      })
      .select(`
        id,
        sets,
        reps, 
        order_index,
        notes,
        exercise:exercises(id, name, description, video_url)
      `)
      .single();

    if (error) {
      console.error("Errore inserimento esercizio:", error);
      throw error;
    }
    
    toast.success("Esercizio aggiunto con successo");
    return data as TemplateExerciseWithNestedExercise;
  } catch (error) {
    console.error("Errore aggiunta esercizio:", error);
    toast.error("Errore aggiunta esercizio");
    return null;
  }
};
