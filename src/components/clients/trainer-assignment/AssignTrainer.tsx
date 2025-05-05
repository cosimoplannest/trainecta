
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AssignTrainerButton } from "./AssignTrainerButton";
import { TrainerSelect } from "./TrainerSelect";
import { NotesInput } from "./NotesInput";
import { useTrainerAssignment } from "./useTrainerAssignment";

interface AssignTrainerProps {
  clientId: string;
  currentTrainerId?: string | null;
  onAssigned: () => void;
}

export const AssignTrainer = ({ clientId, currentTrainerId, onAssigned }: AssignTrainerProps) => {
  const [open, setOpen] = useState(false);
  
  const {
    trainers,
    selectedTrainer,
    setSelectedTrainer,
    notes,
    setNotes,
    loading,
    handleAssign
  } = useTrainerAssignment({ clientId, currentTrainerId, onAssigned });

  const onSubmit = async () => {
    const success = await handleAssign();
    if (success) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AssignTrainerButton currentTrainerId={currentTrainerId} />
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assegna Trainer al Cliente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <TrainerSelect 
            trainers={trainers}
            selectedTrainer={selectedTrainer}
            onSelect={setSelectedTrainer}
          />
          <NotesInput
            notes={notes}
            onChange={setNotes}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Assegnazione..." : "Assegna Trainer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
