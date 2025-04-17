
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ClientListHeaderProps {
  userRole: string | null;
}

export function ClientListHeader({ userRole }: ClientListHeaderProps) {
  const navigate = useNavigate();
  
  // Only admin and operator roles can add new clients
  const canAddClients = userRole === 'admin' || userRole === 'operator';

  return (
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <CardTitle className="text-xl">Lista Clienti</CardTitle>
        <CardDescription>Gestisci e visualizza i clienti della palestra</CardDescription>
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
