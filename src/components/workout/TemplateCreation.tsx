
import React, { useState, useEffect } from 'react';
import { WorkoutTemplate, TemplateExerciseWithNestedExercise, Exercise } from '@/types/workout';
import { useWorkoutTemplates } from '@/hooks/use-workout-templates';
import { CreateTemplateForm } from '@/components/workout/CreateTemplateForm';
import { AddExerciseForm } from '@/components/workout/AddExerciseForm';

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
  
  const [newExercise, setNewExercise] = useState<any>({
    sets: 3,
    reps: "12",
    order_index: 1,
    exercise_id: ""
  });

  const handleCreateTemplate = async () => {
    const createdTemplate = await createTemplate(newTemplate);
    if (createdTemplate) {
      setCurrentTemplate(createdTemplate);
      setIsCreatingTemplate(false);
      setIsAddingExercises(true);
    }
  };

  const handleAddExercise = async () => {
    if (!currentTemplate) return;
    
    const addedExercise = await addExerciseToTemplate(
      currentTemplate.id, 
      newExercise, 
      templateExercises
    );
    
    if (addedExercise) {
      setTemplateExercises([...templateExercises, addedExercise]);
      
      setNewExercise({
        ...newExercise,
        exercise_id: "",
        notes: "",
        order_index: Math.max(...templateExercises.map(e => e.order_index), 0) + 1
      });
    }
  };

  const handleFinishTemplate = async () => {
    if (!currentTemplate) return;
    
    const finalizedTemplate = await finalizeTemplate(currentTemplate.id);
    if (finalizedTemplate) {
      setCurrentTemplate(null);
      setTemplateExercises([]);
      setIsAddingExercises(false);
      onComplete();
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
          gymId={userGymId || undefined}
        />
      )}
    </>
  );
};
