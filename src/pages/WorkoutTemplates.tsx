
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutTemplate, Exercise, TemplateExercise, WorkoutType } from "@/types/workout";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CreateTemplateForm } from "@/components/workout/CreateTemplateForm";
import { TemplateList } from "@/components/workout/TemplateList";
import { TemplateSearch } from "@/components/workout/TemplateSearch";
import { AddExerciseForm } from "@/components/workout/AddExerciseForm";
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

  const addExerciseToTemplate = async () => {
    if (!currentTemplate || !newExercise.exercise_id) return;
    
    try {
      const { data, error } = await supabase
        .from("template_exercises")
        .insert({
          template_id: currentTemplate.id,
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
          exercise_id,
          exercise:exercises(id, name, description, video_url)
        `)
        .single();

      if (error) throw error;
      
      setTemplateExercises([...templateExercises, data as TemplateExercise]);
      
      // Reset the form except for sets and reps
      setNewExercise({
        ...newExercise,
        exercise_id: "",
        notes: "",
        order_index: Math.max(...templateExercises.map(e => e.order_index), 0) + 1
      });
      
      toast.success("Esercizio aggiunto con successo");
    } catch (error) {
      console.error("Error adding exercise:", error);
      toast.error("Errore durante l'aggiunta dell'esercizio");
    }
  };

  const handleExerciseAdded = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
    setNewExercise({ ...newExercise, exercise_id: exercise.id });
  };

  const handleFinishTemplate = async () => {
    if (!currentTemplate) return;
    
    // Refresh the templates list
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
        .eq("id", currentTemplate.id)
        .single();
        
      if (error) throw error;
      
      // Update the templates list with the new template
      setTemplates(templates.map(t => t.id === data.id ? { ...data, assignment_count: 0 } : t));
      setCurrentTemplate(null);
      setTemplateExercises([]);
      setIsAddingExercises(false);
      
      toast.success("Template completato con successo");
    } catch (error) {
      console.error("Error finalizing template:", error);
      toast.error("Errore durante il completamento del template");
    }
  };
  
  const handleViewTemplate = (template: WorkoutTemplate) => {
    setCurrentTemplate(template);
    setIsViewingTemplate(true);
  };
  
  const handleAssignTemplate = (template: WorkoutTemplate) => {
    setCurrentTemplate(template);
    setIsAssigningTemplate(true);
  };
  
  const handleDuplicateTemplate = async (template: WorkoutTemplate) => {
    try {
      const { data, error } = await supabase
        .from("workout_templates")
        .insert({
          name: `${template.name} (Copy)`,
          category: template.category,
          description: template.description,
          type: template.type,
          gym_id: "11111111-1111-1111-1111-111111111111",
          locked: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (template.template_exercises && template.template_exercises.length > 0) {
        const exercisesToInsert = template.template_exercises.map(ex => ({
          template_id: data.id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          order_index: ex.order_index,
          notes: ex.notes
        }));
        
        const { error: exercisesError } = await supabase
          .from("template_exercises")
          .insert(exercisesToInsert);
          
        if (exercisesError) throw exercisesError;
      }
      
      // Refresh the templates list
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
      
      setTemplates([{ ...updatedTemplate, assignment_count: 0 }, ...templates]);
      toast.success("Template duplicato con successo");
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast.error("Errore durante la duplicazione del template");
    }
  };
  
  const handleEditTemplate = (template: WorkoutTemplate) => {
    // Will be implemented in future versions
    toast.info("Funzionalità di modifica in arrivo nelle prossime versioni");
  };
  
  const handleDeleteTemplate = async (template: WorkoutTemplate) => {
    if (confirm(`Sei sicuro di voler eliminare il template "${template.name}"?`)) {
      try {
        // First delete all exercises from the template
        if (template.template_exercises && template.template_exercises.length > 0) {
          const { error: exercisesError } = await supabase
            .from("template_exercises")
            .delete()
            .eq("template_id", template.id);
            
          if (exercisesError) throw exercisesError;
        }
        
        // Then delete the template
        const { error } = await supabase
          .from("workout_templates")
          .delete()
          .eq("id", template.id);
          
        if (error) throw error;
        
        setTemplates(templates.filter(t => t.id !== template.id));
        toast.success("Template eliminato con successo");
      } catch (error) {
        console.error("Error deleting template:", error);
        toast.error("Errore durante l'eliminazione del template");
      }
    }
  };
  
  const handleTemplateAssigned = async () => {
    // Update the assignment count for the current template
    if (!currentTemplate) return;
    
    const updatedTemplates = templates.map(t => 
      t.id === currentTemplate.id 
        ? { ...t, assignment_count: (t.assignment_count || 0) + 1 } 
        : t
    );
    setTemplates(updatedTemplates);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workout Templates</h1>
        
        {!isCreatingTemplate && !isAddingExercises && (
          <Button onClick={() => setIsCreatingTemplate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        )}
      </div>
      
      {isCreatingTemplate && (
        <CreateTemplateForm
          newTemplate={newTemplate as any}
          setNewTemplate={setNewTemplate}
          createTemplate={createTemplate}
          cancelCreate={() => setIsCreatingTemplate(false)}
        />
      )}
      
      {isAddingExercises && currentTemplate && (
        <AddExerciseForm
          newExercise={newExercise}
          setNewExercise={setNewExercise}
          templateExercises={templateExercises}
          exercises={exercises}
          onAddExercise={addExerciseToTemplate}
          onExerciseAdded={handleExerciseAdded}
          onFinish={handleFinishTemplate}
        />
      )}
      
      {!isCreatingTemplate && !isAddingExercises && (
        <>
          <div className="mb-6">
            <TemplateSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          
          <TemplateList
            templates={filteredTemplates}
            loading={loading}
            onViewTemplate={handleViewTemplate}
            onAssignTemplate={handleAssignTemplate}
            onDuplicateTemplate={handleDuplicateTemplate}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </>
      )}
      
      <ViewTemplateDialog
        open={isViewingTemplate}
        onOpenChange={setIsViewingTemplate}
        template={currentTemplate}
      />
      
      <AssignTemplateDialog
        open={isAssigningTemplate}
        onOpenChange={setIsAssigningTemplate}
        template={currentTemplate}
        onAssigned={handleTemplateAssigned}
      />
    </div>
  );
};

export default WorkoutTemplates;
