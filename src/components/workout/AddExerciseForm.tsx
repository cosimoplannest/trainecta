
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Exercise, TemplateExercise } from "@/types/workout";
import { CreateExerciseDialog } from "./CreateExerciseDialog";

interface AddExerciseFormProps {
  newExercise: Partial<TemplateExercise>;
  setNewExercise: (exercise: Partial<TemplateExercise>) => void;
  templateExercises: TemplateExercise[];
  exercises: Exercise[];
  onAddExercise: () => void;
  onExerciseAdded: (exercise: Exercise) => void;
  onFinish: () => void;
  loading?: boolean;
}

export const AddExerciseForm = ({
  newExercise,
  setNewExercise,
  templateExercises,
  exercises,
  onAddExercise,
  onExerciseAdded,
  onFinish,
  loading = false
}: AddExerciseFormProps) => {
  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Add Exercises</h2>
        <Button onClick={onFinish} variant="outline">Finish</Button>
      </div>
      
      {templateExercises.length > 0 && (
        <div className="border rounded-md p-3 mt-2 space-y-2">
          <h3 className="font-medium text-sm">Current Exercises</h3>
          <ul className="space-y-1">
            {templateExercises
              .sort((a, b) => a.order_index - b.order_index)
              .map((ex) => (
                <li key={ex.id} className="text-sm flex items-center gap-2">
                  <span className="bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {ex.order_index}
                  </span>
                  <span className="font-medium">{ex.exercise?.name}</span>
                  <span className="text-muted-foreground">{ex.sets} sets × {ex.reps}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
      
      <div className="grid gap-4 mt-4">
        <div className="flex justify-between items-end">
          <div className="flex-1 mr-2">
            <Label htmlFor="exercise-select">Select Exercise</Label>
            <div className="flex space-x-2">
              <Select
                value={newExercise.exercise_id || ""}
                onValueChange={(value) => setNewExercise({ ...newExercise, exercise_id: value })}
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
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sets">Sets</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="sets"
                type="number"
                min={1}
                value={newExercise.sets || 1}
                onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="reps">Reps</Label>
            <Input
              id="reps"
              value={newExercise.reps || ""}
              onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
              placeholder="e.g. 12 or 8-10"
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <div className="flex justify-between">
            <Label htmlFor="order">Order</Label>
            <span className="text-sm">{newExercise.order_index}</span>
          </div>
          <Slider
            id="order"
            min={1}
            max={Math.max(templateExercises.length + 1, 1)}
            step={1}
            value={[newExercise.order_index || 1]}
            onValueChange={(values) => setNewExercise({ ...newExercise, order_index: values[0] })}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={newExercise.notes || ""}
            onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
            placeholder="Optional notes"
          />
        </div>
        
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
