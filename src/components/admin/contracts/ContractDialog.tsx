
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ContractDialogProps } from "./types";
import { ContractForm } from "./form/ContractForm";

export function ContractDialog({
  open,
  onOpenChange,
  onSubmit,
  isEditing,
  initialData,
  resetForm
}: ContractDialogProps) {
  const [formData, setFormData] = useState(initialData);
  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    if (value === "") return;
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        toast({
          title: "Campo richiesto",
          description: "Inserire un nome per il contratto",
          variant: "destructive",
        });
        return;
      }

      await onSubmit(formData);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error in contract dialog:", error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Contratto" : "Crea Nuovo Contratto"}
          </DialogTitle>
        </DialogHeader>
        
        <ContractForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            resetForm();
          }}>
            Annulla
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Aggiorna" : "Crea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
