
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WorkoutTemplate } from "@/types/workout";

/**
 * Creates a new workout template
 */
export const createWorkoutTemplate = async (
  newTemplate: Partial<WorkoutTemplate>,
  userId: string | undefined,
  gymId: string | null
) => {
  if (!newTemplate.name || !newTemplate.category) {
    toast.error("Please enter a name and category");
    return null;
  }

  if (!gymId) {
    toast.error("No gym associated with your account");
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from("workout_templates")
      .insert({
        name: newTemplate.name,
        category: newTemplate.category,
        description: newTemplate.description,
        type: newTemplate.type,
        gym_id: gymId,
        created_by: userId,
        locked: false
      })
      .select()
      .single();

    if (error) throw error;
    toast.success("Template created successfully. Now add exercises.");
    return data as WorkoutTemplate;
  } catch (error) {
    console.error("Error creating template:", error);
    toast.error("Error creating template. Please try again.");
    return null;
  }
};

/**
 * Finalizes a template creation
 */
export const finalizeWorkoutTemplate = async (templateId: string) => {
  if (!templateId) return null;
  
  try {
    const { data, error } = await supabase
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
      .eq("id", templateId)
      .single();
      
    if (error) throw error;
    
    toast.success("Template completed successfully");
    return { ...data, assignment_count: 0 } as WorkoutTemplate;
  } catch (error) {
    console.error("Error finalizing template:", error);
    toast.error("Error during template completion");
    return null;
  }
};
