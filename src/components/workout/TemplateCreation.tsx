
import React, { useState, useEffect } from 'react';
import { WorkoutTemplate, TemplateExerciseWithNestedExercise, Exercise } from '@/types/workout';
import { useWorkoutTemplates } from '@/hooks/use-workout-templates';
import { CreateTemplateForm } from '@/components/workout/CreateTemplateForm';
import { AddExerciseForm } from '@/components/workout/AddExerciseForm';
import { toast } from "sonner";

interface TemplateCreationProps {
  onComplete: () => void;
}

export const TemplateCreation: React.FC<TemplateCreationProps> = ({ onComplete }) => {
  const { createTemplate, addExerciseToTemplate, finalizeTemplate, exercises: availableExercises, userGymId } = useWorkoutTemplates();
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(true);
  const [isAddingExercises, setIsAddingExercises] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<WorkoutTemplate | null>(null);
  const [templateExercises, setTemplateExercises] = useState<TemplateExerciseWithNestedExercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  // Set initial exercises from the useWorkoutTemplates hook
  useEffect(() => {
    if (availableExercises && availableExercises.length > 0) {
      setExercises(availableExercises);
    }
  }, [availableExercises]);

  const [newTemplate, setNewTemplate] = useState<Partial<WorkoutTemplate>>({
    name: "",
    category: "",
    description: "",
    type: "full_body"
  });
  
  const [newExercise, setNewExercise] = useState({
    sets: 3,
    reps: "12",
    order_index: 1,
    exercise_id: "",
    notes: ""
  });

  const handleCreateTemplate = async () => {
    setLoading(true);
    try {
      const createdTemplate = await createTemplate(newTemplate);
      if (createdTemplate) {
        setCurrentTemplate(createdTemplate);
        setIsCreatingTemplate(false);
        setIsAddingExercises(true);
      }
    } catch (error) {
      console.error("Errore nella creazione del template:", error);
      toast.error("Errore nella creazione del template");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = async () => {
    if (!currentTemplate) {
      toast.error("Nessun template selezionato");
      return;
    }
    
    if (!newExercise.exercise_id) {
      toast.error("Seleziona un esercizio");
      return;
    }
    
    setLoading(true);
    try {
      // Calculate next order index
      const nextOrderIndex = templateExercises.length > 0 
        ? Math.max(...templateExercises.map(e => e.order_index)) + 1 
        : 1;
      
      const exerciseToAdd = {
        ...newExercise,
        order_index: nextOrderIndex
      };
      
      const addedExercise = await addExerciseToTemplate(
        currentTemplate.id, 
        exerciseToAdd, 
        templateExercises
      );
      
      if (addedExercise) {
        setTemplateExercises([...templateExercises, addedExercise]);
        
        setNewExercise({
          sets: 3,
          reps: "12",
          exercise_id: "",
          notes: "",
          order_index: nextOrderIndex + 1
        });
        
        toast.success("Esercizio aggiunto con successo");
      }
    } catch (error) {
      console.error("Errore nell'aggiunta dell'esercizio:", error);
      toast.error("Errore nell'aggiunta dell'esercizio");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishTemplate = async () => {
    if (!currentTemplate) {
      toast.error("Nessun template selezionato");
      return;
    }
    
    if (templateExercises.length === 0) {
      toast.error("Aggiungi almeno un esercizio al template");
      return;
    }
    
    setLoading(true);
    try {
      const finalizedTemplate = await finalizeTemplate(currentTemplate.id);
      if (finalizedTemplate) {
        setCurrentTemplate(null);
        setTemplateExercises([]);
        setIsAddingExercises(false);
        toast.success("Template completato con successo");
        onComplete();
      }
    } catch (error) {
      console.error("Errore nel completamento del template:", error);
      toast.error("Errore nel completamento del template");
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseAdded = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
    setNewExercise({ ...newExercise, exercise_id: exercise.id });
  };

  return (
    <>
      {isCreatingTemplate && (
        <CreateTemplateForm
          newTemplate={newTemplate as any}
          setNewTemplate={setNewTemplate}
          createTemplate={handleCreateTemplate}
          cancelCreate={() => onComplete()}
          loading={loading}
        />
      )}
      
      {isAddingExercises && currentTemplate && (
        <AddExerciseForm
          newExercise={newExercise}
          setNewExercise={setNewExercise}
          templateExercises={templateExercises}
          exercises={exercises}
          onAddExercise={handleAddExercise}
          onExerciseAdded={handleExerciseAdded}
          onFinish={handleFinishTemplate}
          loading={loading}
          gymId={userGymId || undefined}
        />
      )}
    </>
  );
};
