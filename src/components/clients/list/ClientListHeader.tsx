
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

interface ClientListHeaderProps {
  userRole: string;
}

export function ClientListHeader({ userRole }: ClientListHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle>
        {userRole === 'trainer' ? 'I Miei Clienti' : 'Elenco Clienti'}
      </CardTitle>
    </CardHeader>
  );
}
