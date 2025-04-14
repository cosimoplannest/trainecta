
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotesFieldProps {
  notes: string;
  onChange: (notes: string) => void;
}

export const NotesField: React.FC<NotesFieldProps> = ({
  notes,
  onChange
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={notes || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional notes"
      />
    </div>
  );
};
