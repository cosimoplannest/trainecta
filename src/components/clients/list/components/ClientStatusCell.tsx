
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface ClientStatusCellProps {
  nextConfirmationDue?: string | null;
}

export function ClientStatusCell({ nextConfirmationDue }: ClientStatusCellProps) {
  if (!nextConfirmationDue) return null;

  const isOverdue = new Date(nextConfirmationDue) < new Date();

  return (
    <Badge 
      variant={isOverdue ? "destructive" : "outline"} 
      className="text-xs font-normal flex items-center gap-1"
    >
      <Calendar className="h-3 w-3" />
      Conferma: {format(new Date(nextConfirmationDue), "dd/MM/yy")}
    </Badge>
  );
}
