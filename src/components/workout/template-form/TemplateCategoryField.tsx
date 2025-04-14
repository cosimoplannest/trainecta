
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
      <Label htmlFor="template-category">Category</Label>
      <Input
        id="template-category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Beginner, Advanced, etc."
      />
    </div>
  );
};
