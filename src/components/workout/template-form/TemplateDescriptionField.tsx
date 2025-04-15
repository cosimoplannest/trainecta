
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TemplateDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const TemplateDescriptionField: React.FC<TemplateDescriptionFieldProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="template-description">Descrizione</Label>
      <Textarea
        id="template-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Descrivi questo template di allenamento..."
      />
    </div>
  );
};
