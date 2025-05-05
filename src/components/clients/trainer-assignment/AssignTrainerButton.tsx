
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AssignTrainerButtonProps {
  currentTrainerId?: string | null;
}

export const AssignTrainerButton = ({ currentTrainerId }: AssignTrainerButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <DialogTrigger asChild>
      <Button 
        variant="outline" 
        size="sm" 
        className={`flex items-center justify-center gap-1 h-9 ${isMobile ? 'w-full' : ''}`}
      >
        <User className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">
          {currentTrainerId ? "Cambia Trainer" : "Assegna Trainer"}
        </span>
      </Button>
    </DialogTrigger>
  );
};
