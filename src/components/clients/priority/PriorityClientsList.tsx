
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarPlus, User } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";

interface PriorityClient {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  joined_at?: string;
  next_confirmation_due?: string;
  assigned_to?: string;
  users?: {
    full_name: string;
  };
}

interface PriorityClientsListProps {
  clients: PriorityClient[];
  loading: boolean;
  type: 'first-meeting' | 'follow-up';
}

export function PriorityClientsList({ clients, loading, type }: PriorityClientsListProps) {
  const navigate = useNavigate();

  const getUrgencyBadge = (date: string) => {
    const days = differenceInDays(new Date(), new Date(date));
    
    if (days > 14) {
      return <Badge variant="destructive">Urgente</Badge>;
    } else if (days > 7) {
      return <Badge variant="warning">Alta Priorità</Badge>;
    }
    return <Badge variant="info">In Attesa</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <User className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>Nessun cliente {type === 'first-meeting' ? 'in attesa del primo incontro' : 'da ricontattare'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <div 
          key={client.id} 
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="space-y-1">
            <p className="font-medium">
              {client.first_name} {client.last_name}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {type === 'first-meeting' 
                  ? `Iscritto il ${format(new Date(client.created_at), 'dd/MM/yyyy')}`
                  : `Follow-up previsto: ${format(new Date(client.next_confirmation_due!), 'dd/MM/yyyy')}`
                }
              </span>
              {getUrgencyBadge(type === 'first-meeting' ? client.created_at : client.next_confirmation_due!)}
            </div>
            <div className="text-sm text-muted-foreground">
              {client.users?.full_name 
                ? `Trainer: ${client.users.full_name}`
                : "Trainer non assegnato"
              }
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/client/${client.id}`)}
            className="ml-4"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            {type === 'first-meeting' ? 'Programma' : 'Gestisci'}
          </Button>
        </div>
      ))}
    </div>
  );
};
