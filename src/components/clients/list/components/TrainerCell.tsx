
import { User, UserCheck } from "lucide-react";
import { ClientData } from "../../types/client-types";

interface TrainerCellProps {
  client: ClientData;
}

export function TrainerCell({ client }: TrainerCellProps) {
  if (client.users?.full_name) {
    return (
      <div className="flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-green-500" />
        <span>{client.users.full_name}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">Non assegnato</span>
    </div>
  );
}
