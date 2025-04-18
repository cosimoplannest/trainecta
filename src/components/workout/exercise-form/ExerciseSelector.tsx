
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Exercise } from "@/types/workout";
import { CreateExerciseDialog } from "../CreateExerciseDialog";

interface ExerciseSelectorProps {
  exerciseId: string;
  onChange: (exerciseId: string) => void;
  exercises: Exercise[];
  onExerciseAdded: (exercise: Exercise) => void;
  gymId?: string;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exerciseId,
  onChange,
  exercises,
  onExerciseAdded,
  gymId
}) => {
  return (
    <div>
      <Label htmlFor="exercise-select">Seleziona Esercizio</Label>
      <div className="flex space-x-2">
        <Select
          value={exerciseId || ""}
          onValueChange={(value) => onChange(value)}
        >
          <SelectTrigger id="exercise-select" className="flex-1">
            <SelectValue placeholder="Seleziona un esercizio" />
          </SelectTrigger>
          <SelectContent>
            {exercises.map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.id}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CreateExerciseDialog onExerciseAdded={onExerciseAdded} gymId={gymId} />
      </div>
    </div>
  );
};
