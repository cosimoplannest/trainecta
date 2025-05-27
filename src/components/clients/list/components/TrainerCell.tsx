
import { User, UserCheck } from "lucide-react";

interface TrainerCellProps {
  trainerName?: string | null;
}

export function TrainerCell({ trainerName }: TrainerCellProps) {
  return (
    <div className="flex items-center gap-2">
      {trainerName ? (
        <>
          <UserCheck className="h-4 w-4 text-green-500" />
          <span>{trainerName}</span>
        </>
      ) : (
        <>
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Non assegnato</span>
        </>
      )}
    </div>
  );
}
