
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { User } from "lucide-react";

interface AssignTrainerButtonProps {
  currentTrainerId?: string | null;
}

export const AssignTrainerButton = ({ currentTrainerId }: AssignTrainerButtonProps) => {
  return (
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <User className="h-4 w-4" />
        {currentTrainerId ? "Cambia Trainer" : "Assegna Trainer"}
      </Button>
    </DialogTrigger>
  );
};
