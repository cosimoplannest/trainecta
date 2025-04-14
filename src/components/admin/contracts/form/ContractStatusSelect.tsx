
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ContractStatusSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ContractStatusSelect({ value, onValueChange }: ContractStatusSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="status">Stato</Label>
      <Select
        value={value || "active"}
        onValueChange={onValueChange}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Seleziona stato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Attivo</SelectItem>
          <SelectItem value="inactive">Inattivo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
