
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  loading = false,
  submitLabel = "Submit",
  cancelLabel = "Cancel"
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </Button>
    </div>
  );
};
