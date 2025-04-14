
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { 
  WorkoutTemplate, 
  Exercise, 
  TemplateExercise, 
  WorkoutType, 
  TemplateExerciseWithNestedExercise 
} from "@/types/workout";
import { useAuth } from "@/hooks/use-auth";

export const useWorkoutTemplates = () => {
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [userGymId, setUserGymId] = useState<string | null>(null);

  // Fetch user's gym id
  useEffect(() => {
    const fetchUserGymId = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("gym_id")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data && data.gym_id) {
          setUserGymId(data.gym_id);
        } else {
          console.error("User does not have an associated gym");
          uiToast({
            title: "Error",
            description: "User does not have an associated gym",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching user gym ID:", error);
      }
    };

    fetchUserGymId();
  }, [user, uiToast]);

  // Fetch templates and exercises
  useEffect(() => {
    if (!userGymId) return;
    
    const fetchData = async () => {
      setLoading(true);
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
          .eq("gym_id", userGymId)
          .order("created_at", { ascending: false });

        if (templatesError) throw templatesError;

        const templatesWithCounts = await Promise.all(
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

        setTemplates(templatesWithCounts as WorkoutTemplate[]);

        const { data: exercisesData, error: exercisesError } = await supabase
          .from("exercises")
          .select("*")
          .eq("gym_id", userGymId)
          .order("name");

        if (exercisesError) throw exercisesError;
        setExercises(exercisesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        uiToast({
          title: "Error",
          description: "Unable to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userGymId, uiToast]);

  const createTemplate = async (
    newTemplate: Partial<WorkoutTemplate>
  ): Promise<WorkoutTemplate | null> => {
    if (!newTemplate.name || !newTemplate.category) {
      toast.error("Please enter a name and category");
      return null;
    }

    if (!userGymId) {
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
          type: newTemplate.type as WorkoutType,
          gym_id: userGymId,
          created_by: user?.id,
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

  const addExerciseToTemplate = async (
    templateId: string,
    newExercise: Partial<TemplateExercise>,
    currentExercises: TemplateExerciseWithNestedExercise[]
  ): Promise<TemplateExerciseWithNestedExercise | null> => {
    if (!templateId || !newExercise.exercise_id) return null;
    
    try {
      const { data, error } = await supabase
        .from("template_exercises")
        .insert({
          template_id: templateId,
          exercise_id: newExercise.exercise_id,
          sets: newExercise.sets || 3,
          reps: newExercise.reps || "12",
          order_index: newExercise.order_index || 1,
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

      if (error) throw error;
      
      toast.success("Exercise added successfully");
      return data as TemplateExerciseWithNestedExercise;
    } catch (error) {
      console.error("Error adding exercise:", error);
      toast.error("Error adding exercise");
      return null;
    }
  };

  const finalizeTemplate = async (templateId: string): Promise<WorkoutTemplate | null> => {
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
  
  const duplicateTemplate = async (template: WorkoutTemplate): Promise<WorkoutTemplate | null> => {
    if (!userGymId) {
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
          gym_id: userGymId,
          created_by: user?.id,
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
  
  const deleteTemplate = async (templateId: string): Promise<boolean> => {
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

  return {
    templates,
    exercises,
    loading,
    userGymId,
    setTemplates,
    setExercises,
    createTemplate,
    addExerciseToTemplate,
    finalizeTemplate,
    duplicateTemplate,
    deleteTemplate
  };
};
