
import { Badge } from "@/components/ui/badge";

interface UserStatusBadgeProps {
  status: string;
}

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">Attivo</Badge>;
    case 'pending':
      return <Badge variant="warning">In attesa</Badge>;
    case 'disabled':
      return <Badge variant="destructive">Disabilitato</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
