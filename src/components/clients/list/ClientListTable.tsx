import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, UserCheck, Calendar, ShoppingBag, Search } from "lucide-react";
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

  const showNoResults = filteredClients.length === 0 && searchQuery.trim().length > 0;

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Trainer</TableHead>
            <TableHead>Primo Incontro</TableHead>
            <TableHead>Acquisto</TableHead>
            <TableHead>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <span className="text-muted-foreground">Caricamento clienti...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : showNoResults ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <span className="text-muted-foreground font-medium mb-1">Nessun risultato per "{searchQuery}"</span>
                  <span className="text-xs text-muted-foreground">Prova a cercare con un altro nome, email o numero di telefono</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <span className="text-muted-foreground">Nessun cliente trovato</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="font-medium">
                    {client.first_name} {client.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {client.email || client.phone || "Nessun contatto"}
                  </div>
                </TableCell>
                <TableCell>
                  {client.joined_at && (
                    <div className="text-sm text-muted-foreground">
                      Dal {format(new Date(client.joined_at), "dd/MM/yyyy")}
                    </div>
                  )}
                  {client.next_confirmation_due && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      Conferma: {format(new Date(client.next_confirmation_due), "dd/MM/yyyy")}
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
                      <>
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          {client.first_meeting_date 
                            ? format(new Date(client.first_meeting_date), "dd/MM/yyyy")
                            : "Completato"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Da programmare</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    {getPurchaseStatusBadge(client.purchase_type)}
                  </div>
                </TableCell>
                <TableCell>
                  <ClientActions 
                    client={client} 
                    handleViewProfile={handleViewProfile} 
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
