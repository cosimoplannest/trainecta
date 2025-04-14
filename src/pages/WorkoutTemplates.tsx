import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutTemplate, WorkoutType } from "@/types/workout";
import { supabase } from "@/integrations/supabase/client";
import { Check, Edit, Plus, Search, Trash2, File, Copy, EyeIcon, Video, Users } from "lucide-react";
import { toast } from "sonner";
import { CreateExerciseDialog } from "@/components/workout/CreateExerciseDialog";
import { AssignTemplateDialog } from "@/components/workout/AssignTemplateDialog";
import { ViewTemplateDialog } from "@/components/workout/ViewTemplateDialog";

const WorkoutTemplates = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [isAddingExercises, setIsAddingExercises] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newTemplate, setNewTemplate] = useState<Partial<WorkoutTemplate>>({
    name: "",
    category: "",
    description: "",
    type: "full_body"
  });
  
  const [currentTemplate, setCurrentTemplate] = useState<WorkoutTemplate | null>(null);
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>([]);
  const [isViewingTemplate, setIsViewingTemplate] = useState(false);
  const [isAssigningTemplate, setIsAssigningTemplate] = useState(false);

  const [newExercise, setNewExercise] = useState<Partial<TemplateExercise>>({
    sets: 3,
    reps: "12",
    order_index: 1,
    exercise_id: ""
  });

  useEffect(() => {
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

        setTemplates(templatesWithCounts);

        const { data: exercisesData, error: exercisesError } = await supabase
          .from("exercises")
          .select("*")
          .order("name");

        if (exercisesError) throw exercisesError;
        setExercises(exercisesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        uiToast({
          title: "Errore",
          description: "Impossibile caricare i dati",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uiToast]);

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createTemplate = async () => {
    if (!newTemplate.name || !newTemplate.category) {
      toast.error("Inserisci nome e categoria");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("workout_templates")
        .insert({
          name: newTemplate.name,
          category: newTemplate.category,
          description: newTemplate.description,
          type: newTemplate.type as WorkoutType,
          gym_id: "11111111-1111-1111-1111-111111111111",
          locked: false
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentTemplate(data as WorkoutTemplate);
      setIsCreatingTemplate(false);
      setIsAddingExercises(true);
      toast.success("Template creato con successo. Ora aggiungi gli esercizi.");
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Errore durante la creazione del template");
    }
  };

  // Rest of the component remains unchanged
};

export default WorkoutTemplates;
