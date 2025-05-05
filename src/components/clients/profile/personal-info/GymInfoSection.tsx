
import { Users, Clock, Edit } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { AssignTrainer } from "../../trainer-assignment";
import { useIsMobile } from "@/hooks/use-mobile";

interface GymInfoProps {
  trainerName: string | null;
  joinedAt: string;
  clientId: string;
  trainerId: string | null;
  onRefresh: () => void;
  onEditClick: () => void;
}

export const GymInfoSection = ({ 
  trainerName, 
  joinedAt, 
  clientId, 
  trainerId, 
  onRefresh,
  onEditClick 
}: GymInfoProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Informazioni Palestra</h3>
      
      <div className="grid grid-cols-1 gap-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-gray-600">Trainer:</span>{' '}
            <span className="font-medium break-words">{trainerName || "Nessun trainer assegnato"}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-gray-600">Iscrizione:</span>{' '}
            <span className="font-medium">{format(new Date(joinedAt), "d MMMM yyyy", { locale: it })}</span>
          </div>
        </div>
      </div>
      
      <div className={`pt-3 flex ${isMobile ? 'flex-col' : 'sm:flex-row'} gap-2`}>
        <AssignTrainer 
          clientId={clientId} 
          currentTrainerId={trainerId}
          onAssigned={onRefresh}
        />
        
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-1 h-9"
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4" />
          Modifica Dati
        </Button>
      </div>
    </div>
  );
};
