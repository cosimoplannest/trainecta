
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
        size={isMobile ? "default" : "sm"}
        className={`flex items-center justify-center gap-2 ${isMobile ? 'w-full h-10 text-base' : 'h-9'}`}
      >
        <User className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} flex-shrink-0`} />
        <span className="truncate">
          {currentTrainerId ? "Cambia Trainer" : "Assegna Trainer"}
        </span>
      </Button>
    </DialogTrigger>
  );
};
