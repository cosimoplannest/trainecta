
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { AssignTemplateForm } from "./AssignTemplateForm";
import { AssignTemplateDialogProps } from "./types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AssignTemplateDialog({ 
  open, 
  onOpenChange, 
  template, 
  onAssigned 
}: AssignTemplateDialogProps) {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (open && !template) {
      toast.error("Nessun template selezionato");
      onOpenChange(false);
      return;
    }
    setIsReady(true);
  }, [open, template, onOpenChange]);

  if (!isReady || !template) return null;

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
