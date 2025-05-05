
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ClientData } from "../../types/client-types";

interface ClientStatusCellProps {
  client: ClientData;
}

export function ClientStatusCell({ client }: ClientStatusCellProps) {
  if (!client.next_confirmation_due) return null;
  
  const isPastDue = new Date(client.next_confirmation_due) < new Date();
  
  return (
    <Badge 
      variant={isPastDue ? "destructive" : "outline"} 
      className="text-xs font-normal flex items-center gap-1"
    >
      <Calendar className="h-3 w-3" />
      Conferma: {format(new Date(client.next_confirmation_due), "dd/MM/yy")}
    </Badge>
  );
}
