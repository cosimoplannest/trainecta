
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClientData } from "../types/client-types";
import { Calendar, Mail, Phone, User, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ClientActions } from "./ClientActions";
import { Card, CardContent } from "@/components/ui/card";

interface ClientListMobileViewProps {
  clients: ClientData[];
  loading: boolean;
  handleViewProfile: (clientId: string) => void;
}

export function ClientListMobileView({
  clients,
  loading,
  handleViewProfile,
}: ClientListMobileViewProps) {
  const navigate = useNavigate();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600', 
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600', 
      'bg-amber-100 text-amber-600', 
      'bg-rose-100 text-rose-600',
      'bg-sky-100 text-sky-600',
      'bg-emerald-100 text-emerald-600',
      'bg-indigo-100 text-indigo-600'
    ];
    
    // Simple hash function to determine color based on name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 mt-4">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-10">
        <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
        <h3 className="font-medium text-lg mb-1">Nessun cliente trovato</h3>
        <p className="text-muted-foreground text-sm">
          Prova a modificare i filtri di ricerca o aggiungi un nuovo cliente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      {clients.map((client) => (
        <Card key={client.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className={getAvatarColor(`${client.first_name} ${client.last_name}`)}>
                  <AvatarFallback>{getInitials(client.first_name, client.last_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-base">
                    {client.first_name} {client.last_name}
                  </h3>
                  {client.joined_at && (
                    <p className="text-xs text-muted-foreground">
                      Cliente dal {format(new Date(client.joined_at), "dd/MM/yyyy")}
                    </p>
                  )}
                </div>
              </div>
              
              <ClientActions client={client} handleViewProfile={handleViewProfile} />
            </div>
            
            <div className="mt-3 space-y-2 text-sm">
              {client.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span>{client.phone}</span>
                </div>
              )}
              
              {client.users?.full_name && (
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                  <span>{client.users.full_name}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {client.next_confirmation_due && (
                <Badge variant={new Date(client.next_confirmation_due) < new Date() ? "destructive" : "outline"} 
                       className="text-xs font-normal flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Conferma: {format(new Date(client.next_confirmation_due), "dd/MM/yy")}
                </Badge>
              )}
              
              {client.first_meeting_completed !== undefined && (
                <Badge variant="outline" 
                       className={`text-xs font-normal flex items-center gap-1 ${client.first_meeting_completed ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {client.first_meeting_completed 
                    ? "Primo Incontro Completato" 
                    : "Primo Incontro da Programmare"}
                </Badge>
              )}
            </div>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full mt-3" 
              onClick={() => handleViewProfile(client.id)}
            >
              Visualizza Profilo
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
