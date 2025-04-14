
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { contractTypes } from "../constants";

interface ContractTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ContractTypeSelect({ value, onValueChange }: ContractTypeSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="type">Tipologia</Label>
      <Select
        value={value || "subscription"}
        onValueChange={onValueChange}
      >
        <SelectTrigger id="type">
          <SelectValue placeholder="Seleziona tipo" />
        </SelectTrigger>
        <SelectContent>
          {contractTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
