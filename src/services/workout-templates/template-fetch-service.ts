
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WorkoutTemplate, Exercise } from "@/types/workout";

/**
 * Fetches workout templates for a specific gym
 */
export const fetchWorkoutTemplates = async (gymId: string) => {
  try {
    const { data: templatesData, error: templatesError } = await supabase
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
      .eq("gym_id", gymId)
      .order("created_at", { ascending: false });

    if (templatesError) throw templatesError;
    
    return templatesData;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

/**
 * Fetches template assignment counts
 */
export const fetchTemplateAssignmentCounts = async (templatesData: WorkoutTemplate[]) => {
  try {
    return await Promise.all(
      templatesData.map(async (template) => {
        const { count, error } = await supabase
          .from("assigned_templates")
          .select("*", { count: "exact", head: true })
          .eq("template_id", template.id);

        return {
          ...template,
          assignment_count: count || 0
        } as WorkoutTemplate;
      })
    );
  } catch (error) {
    console.error("Error fetching assignment counts:", error);
    throw error;
  }
};

/**
 * Fetches exercises for a specific gym
 */
export const fetchExercises = async (gymId: string) => {
  try {
    const { data: exercisesData, error: exercisesError } = await supabase
      .from("exercises")
      .select("*")
      .eq("gym_id", gymId)
      .order("name");

    if (exercisesError) throw exercisesError;
    return exercisesData;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};
