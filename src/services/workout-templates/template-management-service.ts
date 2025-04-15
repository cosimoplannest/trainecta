
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WorkoutTemplate } from "@/types/workout";

/**
 * Duplicates a template
 */
export const duplicateWorkoutTemplate = async (
  template: WorkoutTemplate,
  userId: string | undefined,
  gymId: string | null
) => {
  if (!gymId) {
    toast.error("No gym associated with your account");
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from("workout_templates")
      .insert({
        name: `${template.name} (Copy)`,
        category: template.category,
        description: template.description,
        type: template.type,
        gym_id: gymId,
        created_by: userId,
        locked: false
      })
      .select()
      .single();
      
    if (error) throw error;
    
    if (template.template_exercises && template.template_exercises.length > 0) {
      const exercisesToInsert = template.template_exercises.map(ex => {
        const exerciseId = 'exercise_id' in ex ? ex.exercise_id : ex.exercise.id;
        
        return {
          template_id: data.id,
          exercise_id: exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          order_index: ex.order_index,
          notes: ex.notes
        };
      });
      
      const { error: exercisesError } = await supabase
        .from("template_exercises")
        .insert(exercisesToInsert);
        
      if (exercisesError) throw exercisesError;
    }
    
    const { data: updatedTemplate, error: fetchError } = await supabase
      .from("workout_templates")
      .select(`
        *,
        user:users!workout_templates_created_by_fkey(full_name),
        template_exercises(
          id,
          sets,
          reps,
          order_index,
          notes,
          exercise:exercises(id, name, description, video_url)
        )
      `)
      .eq("id", data.id)
      .single();
      
    if (fetchError) throw fetchError;
    
    toast.success("Template duplicated successfully");
    return { ...updatedTemplate, assignment_count: 0 } as WorkoutTemplate;
  } catch (error) {
    console.error("Error duplicating template:", error);
    toast.error("Error duplicating template");
    return null;
  }
};

/**
 * Deletes a template
 */
export const deleteWorkoutTemplate = async (templateId: string) => {
  try {
    const { error: exercisesError } = await supabase
      .from("template_exercises")
      .delete()
      .eq("template_id", templateId);
      
    if (exercisesError) throw exercisesError;
    
    const { error } = await supabase
      .from("workout_templates")
      .delete()
      .eq("id", templateId);
      
    if (error) throw error;
    
    toast.success("Template deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting template:", error);
    toast.error("Error during template deletion");
    return false;
  }
};
