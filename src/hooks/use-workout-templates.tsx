
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkoutTemplate, Exercise, TemplateExercise, TemplateExerciseWithNestedExercise } from "@/types/workout";
import { useAuth } from "@/hooks/use-auth";
import { 
  fetchWorkoutTemplates, 
  fetchTemplateAssignmentCounts, 
  fetchExercises,
  createWorkoutTemplate,
  addExerciseToTemplate,
  finalizeWorkoutTemplate,
  duplicateWorkoutTemplate,
  deleteWorkoutTemplate
} from "@/services/workout-templates";

export const useWorkoutTemplates = () => {
  const { toast } = useToast();
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
          toast({
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
  }, [user, toast]);

  // Fetch templates and exercises
  useEffect(() => {
    if (!userGymId) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch workout templates
        const templatesData = await fetchWorkoutTemplates(userGymId);
        
        // Get assignment counts for each template
        const templatesWithCounts = await fetchTemplateAssignmentCounts(templatesData);
        setTemplates(templatesWithCounts);

        // Fetch exercises
        const exercisesData = await fetchExercises(userGymId);
        setExercises(exercisesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Unable to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userGymId, toast]);

  const createTemplate = async (newTemplate: Partial<WorkoutTemplate>) => {
    return await createWorkoutTemplate(newTemplate, user?.id, userGymId);
  };

  const addExerciseToTemplateWrapper = async (
    templateId: string,
    newExercise: Partial<TemplateExercise>,
    currentExercises: TemplateExerciseWithNestedExercise[]
  ) => {
    return await addExerciseToTemplate(templateId, newExercise, currentExercises);
  };

  const finalizeTemplate = async (templateId: string) => {
    const finalizedTemplate = await finalizeWorkoutTemplate(templateId);
    
    if (finalizedTemplate) {
      setTemplates(prevTemplates => [finalizedTemplate, ...prevTemplates]);
    }
    
    return finalizedTemplate;
  };
  
  const duplicateTemplate = async (template: WorkoutTemplate) => {
    const duplicated = await duplicateWorkoutTemplate(template, user?.id, userGymId);
    return duplicated;
  };
  
  const deleteTemplate = async (templateId: string) => {
    return await deleteWorkoutTemplate(templateId);
  };

  return {
    templates,
    exercises,
    loading,
    userGymId,
    setTemplates,
    setExercises,
    createTemplate,
    addExerciseToTemplate: addExerciseToTemplateWrapper,
    finalizeTemplate,
    duplicateTemplate,
    deleteTemplate
  };
};
