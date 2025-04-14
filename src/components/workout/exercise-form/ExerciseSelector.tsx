
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
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exerciseId,
  onChange,
  exercises,
  onExerciseAdded
}) => {
  return (
    <div>
      <Label htmlFor="exercise-select">Select Exercise</Label>
      <div className="flex space-x-2">
        <Select
          value={exerciseId || ""}
          onValueChange={(value) => onChange(value)}
        >
          <SelectTrigger id="exercise-select" className="flex-1">
            <SelectValue placeholder="Select an exercise" />
          </SelectTrigger>
          <SelectContent>
            {exercises.map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.id}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CreateExerciseDialog onExerciseAdded={onExerciseAdded} />
      </div>
    </div>
  );
};
