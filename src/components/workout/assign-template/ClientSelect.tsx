
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "./types";

interface ClientSelectProps {
  selectedClient: string;
  setSelectedClient: (clientId: string) => void;
  filteredClients: Client[];
  clientsLoading: boolean;
}

export function ClientSelect({ selectedClient, setSelectedClient, filteredClients, clientsLoading }: ClientSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="client">Cliente</Label>
      <Select value={selectedClient} onValueChange={setSelectedClient}>
        <SelectTrigger id="client">
          <SelectValue placeholder={clientsLoading ? "Caricamento clienti..." : "Seleziona cliente"} />
        </SelectTrigger>
        <SelectContent>
          {filteredClients.length === 0 ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Nessun cliente trovato
            </div>
          ) : (
            filteredClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.last_name} {client.first_name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
