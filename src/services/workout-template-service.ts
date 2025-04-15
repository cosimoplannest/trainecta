import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  WorkoutTemplate, 
  Exercise, 
  TemplateExercise, 
  TemplateExerciseWithNestedExercise 
} from "@/types/workout";

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
