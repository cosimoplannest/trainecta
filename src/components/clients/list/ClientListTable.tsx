
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientData } from "../types/client-types";
import { ClientActions } from "./ClientActions";
import { ClientNameCell } from "./components/ClientNameCell";
import { ClientContactCell } from "./components/ClientContactCell";
import { ClientStatusCell } from "./components/ClientStatusCell";
import { TrainerCell } from "./components/TrainerCell";
import { MeetingStatusCell } from "./components/MeetingStatusCell";
import { PurchaseTypeCell } from "./components/PurchaseTypeCell";
import { TableEmptyState } from "./components/TableEmptyState";
import { TableLoadingState } from "./components/TableLoadingState";

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
  const showNoResults = filteredClients.length === 0 && searchQuery.trim().length > 0;
  const showEmptyState = loading || showNoResults || filteredClients.length === 0;

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
            <TableLoadingState />
          ) : showEmptyState ? (
            <TableEmptyState searchQuery={searchQuery} />
          ) : (
            filteredClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-slate-50/50 group">
                <TableCell>
                  <ClientNameCell 
                    firstName={client.first_name}
                    lastName={client.last_name}
                    joinedAt={client.joined_at}
                  />
                </TableCell>
                <TableCell>
                  <ClientContactCell 
                    email={client.email}
                    phone={client.phone}
                  />
                </TableCell>
                <TableCell>
                  <ClientStatusCell 
                    nextConfirmationDue={client.next_confirmation_due}
                  />
                </TableCell>
                <TableCell>
                  <TrainerCell 
                    trainerName={client.users?.full_name}
                  />
                </TableCell>
                <TableCell>
                  <MeetingStatusCell 
                    firstMeetingCompleted={client.first_meeting_completed}
                    firstMeetingDate={client.first_meeting_date}
                  />
                </TableCell>
                <TableCell>
                  <PurchaseTypeCell 
                    purchaseType={client.purchase_type}
                  />
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
