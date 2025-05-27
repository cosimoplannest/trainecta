
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface MeetingStatusCellProps {
  firstMeetingCompleted?: boolean;
  firstMeetingDate?: string | null;
}

export function MeetingStatusCell({ firstMeetingCompleted, firstMeetingDate }: MeetingStatusCellProps) {
  return (
    <div className="flex items-center gap-2">
      {firstMeetingCompleted ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span className="text-xs">
            {firstMeetingDate 
              ? format(new Date(firstMeetingDate), "dd/MM/yyyy")
              : "Completato"}
          </span>
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span className="text-xs">Da programmare</span>
        </Badge>
      )}
    </div>
  );
}
