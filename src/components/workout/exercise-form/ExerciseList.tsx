
import React from "react";
import { TemplateExerciseWithNestedExercise } from "@/types/workout";

interface ExerciseListProps {
  exercises: TemplateExerciseWithNestedExercise[];
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  if (exercises.length === 0) return null;
  
  return (
    <div className="border rounded-md p-3 mt-2 space-y-2">
      <h3 className="font-medium text-sm">Esercizi Aggiunti</h3>
      <ul className="space-y-1">
        {exercises
          .sort((a, b) => a.order_index - b.order_index)
          .map((ex) => (
            <li key={ex.id} className="text-sm flex items-center gap-2">
              <span className="bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {ex.order_index}
              </span>
              <span className="font-medium">{ex.exercise?.name}</span>
              <span className="text-muted-foreground">{ex.sets} serie × {ex.reps}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};
