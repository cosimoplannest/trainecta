
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, FileText, MoreHorizontal, Edit, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ClientData } from "../types/client-types";

interface ClientListTableProps {
  clients: ClientData[];
  loading: boolean;
  filteredClients: ClientData[];
  handleViewProfile: (clientId: string) => void;
}

export function ClientListTable({ 
  clients, 
  loading, 
  filteredClients, 
  handleViewProfile 
}: ClientListTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contatto</TableHead>
            <TableHead>Iscrizione</TableHead>
            <TableHead>Trainer</TableHead>
            <TableHead>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <span className="text-muted-foreground">Caricamento clienti...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
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
                  {client.gender && (
                    <div className="text-sm text-muted-foreground">
                      {client.gender === 'male' ? 'Uomo' : client.gender === 'female' ? 'Donna' : client.gender}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {client.email && (
                    <div className="text-sm">{client.email}</div>
                  )}
                  {client.phone && (
                    <div className="text-sm text-muted-foreground">{client.phone}</div>
                  )}
                </TableCell>
                <TableCell>
                  {client.joined_at && (
                    <Badge variant="outline" className="font-normal">
                      Dal {format(new Date(client.joined_at), "dd/MM/yyyy")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {client.users?.full_name ? (
                    <div className="text-sm">{client.users.full_name}</div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Non assegnato</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewProfile(client.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Modifica</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Elimina</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
