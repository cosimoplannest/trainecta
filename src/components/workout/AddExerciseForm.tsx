
import React from "react";
import { Button } from "@/components/ui/button";
import { Exercise, TemplateExercise, TemplateExerciseWithNestedExercise } from "@/types/workout";
import { ExerciseSelector } from "./exercise-form/ExerciseSelector";
import { SetsRepsInputs } from "./exercise-form/SetsRepsInputs";
import { OrderSelector } from "./exercise-form/OrderSelector";
import { NotesField } from "./exercise-form/NotesField";
import { ExerciseList } from "./exercise-form/ExerciseList";

interface AddExerciseFormProps {
  newExercise: Partial<TemplateExercise>;
  setNewExercise: (exercise: Partial<TemplateExercise>) => void;
  templateExercises: TemplateExerciseWithNestedExercise[];
  exercises: Exercise[];
  onAddExercise: () => void;
  onExerciseAdded: (exercise: Exercise) => void;
  onFinish: () => void;
  loading?: boolean;
  gymId?: string;
}

export const AddExerciseForm = ({
  newExercise,
  setNewExercise,
  templateExercises,
  exercises,
  onAddExercise,
  onExerciseAdded,
  onFinish,
  loading = false,
  gymId
}: AddExerciseFormProps) => {
  const handleExerciseChange = (exerciseId: string) => {
    setNewExercise({ ...newExercise, exercise_id: exerciseId });
  };

  const handleSetsChange = (sets: number) => {
    setNewExercise({ ...newExercise, sets });
  };

  const handleRepsChange = (reps: string) => {
    setNewExercise({ ...newExercise, reps });
  };

  const handleOrderChange = (orderIndex: number) => {
    setNewExercise({ ...newExercise, order_index: orderIndex });
  };

  const handleNotesChange = (notes: string) => {
    setNewExercise({ ...newExercise, notes });
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Add Exercises</h2>
        <Button onClick={onFinish} variant="outline">Finish</Button>
      </div>
      
      <ExerciseList exercises={templateExercises} />
      
      <div className="grid gap-4 mt-4">
        <ExerciseSelector 
          exerciseId={newExercise.exercise_id || ""}
          onChange={handleExerciseChange}
          exercises={exercises}
          onExerciseAdded={onExerciseAdded}
          gymId={gymId}
        />
        
        <SetsRepsInputs 
          sets={newExercise.sets || 1}
          reps={newExercise.reps || ""}
          onSetsChange={handleSetsChange}
          onRepsChange={handleRepsChange}
        />
        
        <OrderSelector 
          orderIndex={newExercise.order_index || 1}
          maxOrder={templateExercises.length + 1}
          onChange={handleOrderChange}
        />
        
        <NotesField 
          notes={newExercise.notes || ""}
          onChange={handleNotesChange}
        />
        
        <Button 
          onClick={onAddExercise} 
          disabled={loading || !newExercise.exercise_id}
        >
          {loading ? "Adding..." : "Add Exercise"}
        </Button>
      </div>
    </div>
  );
};
