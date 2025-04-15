
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SetsRepsInputsProps {
  sets: number;
  reps: string;
  onSetsChange: (sets: number) => void;
  onRepsChange: (reps: string) => void;
}

export const SetsRepsInputs: React.FC<SetsRepsInputsProps> = ({
  sets,
  reps,
  onSetsChange,
  onRepsChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="sets">Serie</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="sets"
            type="number"
            min={1}
            value={sets || 1}
            onChange={(e) => onSetsChange(parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="reps">Ripetizioni</Label>
        <Input
          id="reps"
          value={reps || ""}
          onChange={(e) => onRepsChange(e.target.value)}
          placeholder="es. 12 o 8-10"
        />
      </div>
    </div>
  );
};
