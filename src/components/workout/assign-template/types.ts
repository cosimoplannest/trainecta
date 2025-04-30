
import { WorkoutTemplate } from "@/types/workout";

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AssignTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: WorkoutTemplate | null;
  onAssigned: () => void;
}
