
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ClientData } from "../../types/client-types";

interface MeetingStatusCellProps {
  client: ClientData;
}

export function MeetingStatusCell({ client }: MeetingStatusCellProps) {
  if (client.first_meeting_completed) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
        >
          <Calendar className="h-3 w-3" />
          <span className="text-xs">
            {client.first_meeting_date 
              ? format(new Date(client.first_meeting_date), "dd/MM/yyyy")
              : "Completato"}
          </span>
        </Badge>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
      >
        <Calendar className="h-3 w-3" />
        <span className="text-xs">Da programmare</span>
      </Badge>
    </div>
  );
}
