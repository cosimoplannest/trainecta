
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { durations } from "../constants";

interface ContractDurationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ContractDurationSelect({ value, onValueChange }: ContractDurationSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="duration">Durata</Label>
      <Select
        value={value || "30"}
        onValueChange={onValueChange}
      >
        <SelectTrigger id="duration">
          <SelectValue placeholder="Seleziona durata" />
        </SelectTrigger>
        <SelectContent>
          {durations.map((duration) => (
            <SelectItem key={duration.value} value={duration.value}>
              {duration.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
