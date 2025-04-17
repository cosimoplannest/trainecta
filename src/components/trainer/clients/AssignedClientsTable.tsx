
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Eye, 
  Dumbbell, 
  MessageSquare, 
  Calendar 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  joined_at?: string;
};

export function AssignedClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("id, first_name, last_name, email, phone, joined_at")
        .eq("assigned_to", user?.id)
        .order("last_name", { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching assigned clients:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i clienti assegnati",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  const handleAssignTemplate = (clientId: string) => {
    navigate(`/workout-templates?assignTo=${clientId}`);
  };

  const handleSendMessage = (clientId: string) => {
    navigate(`/communications?client=${clientId}`);
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || 
           (client.email && client.email.toLowerCase().includes(query)) ||
           (client.phone && client.phone.includes(query));
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">I Miei Clienti</h3>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contatto</TableHead>
              <TableHead>Data Iscrizione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[120px] float-right" /></TableCell>
                </TableRow>
              ))
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.first_name} {client.last_name}
                  </TableCell>
                  <TableCell>
                    {client.email || client.phone || "Nessun contatto"}
                  </TableCell>
                  <TableCell>
                    {client.joined_at 
                      ? new Date(client.joined_at).toLocaleDateString('it-IT') 
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewProfile(client.id)}
                        title="Visualizza profilo"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAssignTemplate(client.id)}
                        title="Assegna scheda"
                      >
                        <Dumbbell className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSendMessage(client.id)}
                        title="Invia messaggio"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchQuery 
                    ? "Nessun cliente trovato con i criteri di ricerca" 
                    : "Nessun cliente assegnato"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredClients.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Mostrati {filteredClients.length} di {clients.length} clienti
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate("/client-management")}>
            Vedi tutti i clienti
          </Button>
        </div>
      )}
    </div>
  );
}
