
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  joined_at: string;
  source: string;
  assigned_to: string;
  trainer_name?: string;
}

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [trainers, setTrainers] = useState<{ id: string; full_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("clients")
        .select(`
          *,
          assigned_to_user:users!clients_assigned_to_fkey(id, full_name)
        `);

      // Apply filters if provided
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
        );
      }

      if (selectedTrainer) {
        query = query.eq("assigned_to", selectedTrainer);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      // Format the client data
      const formattedClients = data.map((client) => ({
        ...client,
        trainer_name: client.assigned_to_user?.[0]?.full_name || "",
      }));

      setClients(formattedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nel caricamento dei clienti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("role", "trainer");

      if (error) throw error;
      setTrainers(data || []);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

  useEffect(() => {
    fetchTrainers();
    fetchClients();
  }, []);

  // Refetch when search or trainer filter changes
  useEffect(() => {
    fetchClients();
  }, [search, selectedTrainer]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleTrainerFilter = (value: string) => {
    setSelectedTrainer(value === "all" ? null : value);
  };

  const handleViewClient = (clientId: string) => {
    // In the future, this will navigate to client detail page
    toast({
      title: "Visualizzazione cliente",
      description: "Funzionalità in fase di sviluppo",
    });
  };

  const handleRefresh = () => {
    fetchClients();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca cliente..."
                className="pl-8"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div className="flex flex-row gap-3">
              <Select onValueChange={handleTrainerFilter} defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtra per trainer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i trainer</SelectItem>
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={() => navigate("/client-management?tab=add")}>
                <UserPlus className="h-4 w-4 mr-2" />
                Nuovo
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contatti</TableHead>
                    <TableHead className="hidden md:table-cell">Trainer</TableHead>
                    <TableHead className="hidden md:table-cell">Iscritto da</TableHead>
                    <TableHead className="hidden md:table-cell">Origine</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nessun cliente trovato.
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="font-medium">
                            {client.first_name} {client.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {client.trainer_name || "Non assegnato"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {client.email || <span className="text-muted-foreground">No email</span>}
                          </div>
                          <div className="text-sm">
                            {client.phone || <span className="text-muted-foreground">No tel</span>}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {client.trainer_name || "Non assegnato"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {client.joined_at
                            ? format(new Date(client.joined_at), "dd/MM/yyyy", { locale: it })
                            : "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {client.source || "Non specificato"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleViewClient(client.id)}
                          >
                            Dettagli
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientList;
