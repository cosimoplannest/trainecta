
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ClientData } from "../../types/client-types";
import { getAvatarColor, getInitials } from "../utils/tableUtils";

interface ClientNameCellProps {
  client: ClientData;
}

export function ClientNameCell({ client }: ClientNameCellProps) {
  const initials = getInitials(client.first_name, client.last_name);
  const avatarColor = getAvatarColor(`${client.first_name} ${client.last_name}`);
  
  return (
    <div className="flex items-center gap-3">
      <Avatar className={avatarColor}>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">
          {client.first_name} {client.last_name}
        </div>
        {client.joined_at && (
          <div className="text-xs text-muted-foreground">
            Cliente dal {format(new Date(client.joined_at), "dd/MM/yyyy")}
          </div>
        )}
      </div>
    </div>
  );
}
