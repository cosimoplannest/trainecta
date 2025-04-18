
import { Badge } from "@/components/ui/badge";

interface TrainerStatusBadgeProps {
  status: string;
}

export const TrainerStatusBadge = ({ status }: TrainerStatusBadgeProps) => {
  const variant = status === 'active' ? 'success' : 'destructive';
  const label = status === 'active' ? 'Attivo' : 'Inattivo';

  return (
    <Badge variant={variant} className="capitalize">
      {label}
    </Badge>
  );
};
