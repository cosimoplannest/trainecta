
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, UserCheck, Calendar, ShoppingBag, Search, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { ClientData } from "../types/client-types";
import { ClientActions } from "./ClientActions";

interface ClientListTableProps {
  clients: ClientData[];
  loading: boolean;
  filteredClients: ClientData[];
  handleViewProfile: (clientId: string) => void;
  searchQuery?: string;
}

export function ClientListTable({ 
  clients, 
  loading, 
  filteredClients, 
  handleViewProfile,
  searchQuery = "" 
}: ClientListTableProps) {
  const getPurchaseStatusBadge = (purchaseType: string | null) => {
    if (!purchaseType || purchaseType === 'none') {
      return <Badge variant="outline" className="bg-yellow-50">In attesa</Badge>;
    }
    const variants = {
      'package': 'bg-green-50 text-green-700 border-green-200',
      'custom_plan': 'bg-blue-50 text-blue-700 border-blue-200'
    };
    const labels = {
      'package': 'Pacchetto',
      'custom_plan': 'Scheda personalizzata'
    };
    return (
      <Badge 
        variant="outline" 
        className={variants[purchaseType as keyof typeof variants]}
      >
        {labels[purchaseType as keyof typeof labels]}
      </Badge>
    );
  };

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

  const showNoResults = filteredClients.length === 0 && searchQuery.trim().length > 0;

  return (
    <div className="rounded-md border mt-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-medium">Cliente</TableHead>
            <TableHead className="font-medium">Contatto</TableHead>
            <TableHead className="font-medium">Stato</TableHead>
            <TableHead className="font-medium">Trainer</TableHead>
            <TableHead className="font-medium">Primo Incontro</TableHead>
            <TableHead className="font-medium">Acquisto</TableHead>
            <TableHead className="font-medium text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <span className="text-muted-foreground">Caricamento clienti...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : showNoResults ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <span className="text-muted-foreground font-medium mb-1">Nessun risultato per "{searchQuery}"</span>
                  <span className="text-xs text-muted-foreground">Prova a cercare con un altro nome, email o numero di telefono</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <span className="text-muted-foreground">Nessun cliente trovato</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-slate-50/50 group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className={getAvatarColor(`${client.first_name} ${client.last_name}`)}>
                      <AvatarFallback>{getInitials(client.first_name, client.last_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {client.first_name} {client.last_name}
                      </div>
                      {client.joined_at && (
                        <div className="text-xs text-muted-foreground">
                          Cliente dal {format(new Date(client.joined_at), "dd/MM/yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {client.email && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate max-w-[180px]">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {client.next_confirmation_due && (
                    <Badge variant={new Date(client.next_confirmation_due) < new Date() ? "destructive" : "outline"} 
                           className="text-xs font-normal flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Conferma: {format(new Date(client.next_confirmation_due), "dd/MM/yy")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {client.users?.full_name ? (
                      <>
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <span>{client.users.full_name}</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Non assegnato</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {client.first_meeting_completed ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                          {client.first_meeting_date 
                            ? format(new Date(client.first_meeting_date), "dd/MM/yyyy")
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    {getPurchaseStatusBadge(client.purchase_type)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ClientActions 
                      client={client} 
                      handleViewProfile={handleViewProfile} 
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
