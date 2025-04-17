
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { AssignTemplateForm } from "./AssignTemplateForm";
import { AssignTemplateDialogProps } from "./types";

export function AssignTemplateDialog({ 
  open, 
  onOpenChange, 
  template, 
  onAssigned 
}: AssignTemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assegna Template</DialogTitle>
          <DialogDescription>
            {template ? `Assegna "${template.name}" a un cliente` : "Seleziona un template"}
          </DialogDescription>
        </DialogHeader>
        
        <AssignTemplateForm
          open={open}
          onOpenChange={onOpenChange}
          template={template}
          onAssigned={onAssigned}
        />
      </DialogContent>
    </Dialog>
  );
}
