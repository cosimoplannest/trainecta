
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkoutType } from "@/types/workout";
import { workoutTypes } from "../workout-types-data";

interface WorkoutTypeFieldProps {
  value: WorkoutType;
  onChange: (value: WorkoutType) => void;
}

export const WorkoutTypeField: React.FC<WorkoutTypeFieldProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="template-type">Tipo di Allenamento</Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as WorkoutType)}
      >
        <SelectTrigger id="template-type">
          <SelectValue placeholder="Seleziona tipo di allenamento" />
        </SelectTrigger>
        <SelectContent>
          {workoutTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
