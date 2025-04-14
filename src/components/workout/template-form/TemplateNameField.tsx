
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const TemplateNameField: React.FC<TemplateNameFieldProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="template-name">Template Name</Label>
      <Input
        id="template-name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Beginner Full Body"
      />
    </div>
  );
};
