
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ClientListHeaderProps {
  userRole: string | null;
}

export function ClientListHeader({ userRole }: ClientListHeaderProps) {
  const navigate = useNavigate();
  
  // Only admin and operator roles can add new clients
  const canAddClients = userRole === 'admin' || userRole === 'operator';

  return (
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-xl">Clienti</CardTitle>
          <CardDescription>Gestisci e visualizza i clienti della palestra</CardDescription>
        </div>
      </div>
      
      {canAddClients && (
        <Button onClick={() => navigate("/client-management?tab=add")} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Aggiungi Cliente
        </Button>
      )}
    </CardHeader>
  );
}
