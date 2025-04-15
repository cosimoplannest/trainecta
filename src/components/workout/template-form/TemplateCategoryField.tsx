
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateCategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const TemplateCategoryField: React.FC<TemplateCategoryFieldProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="template-category">Categoria</Label>
      <Input
        id="template-category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="es. Principiante, Avanzato, ecc."
      />
    </div>
  );
};
