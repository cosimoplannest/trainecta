
import { Mail, Phone } from "lucide-react";
import { ClientData } from "../../types/client-types";

interface ClientContactCellProps {
  client: ClientData;
}

export function ClientContactCell({ client }: ClientContactCellProps) {
  return (
    <div className="space-y-1">
      {client.email && (
        <div className="flex items-center gap-1.5 text-sm">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate max-w-[180px]">{client.email}</span>
        </div>
      )}
      {client.phone && (
        <div className="flex items-center gap-1.5 text-sm">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{client.phone}</span>
        </div>
      )}
    </div>
  );
}
