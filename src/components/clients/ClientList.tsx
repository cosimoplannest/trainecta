
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Search, User, MoreHorizontal, Edit, Trash, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { AssignTrainer } from "./AssignTrainer";
import { useAuth } from "@/hooks/use-auth";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        // Create a base query
        let query = supabase
          .from("clients")
          .select(`
            *,
            users(full_name)
          `)
          .order("last_name", { ascending: true });
        
        // If user is a trainer, only fetch their assigned clients
        if (userRole === 'trainer' && user) {
          query = query.eq('assigned_to', user.id);
        }
        
        const { data, error } = await query;

        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare l'elenco dei clienti",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast, user, userRole]);

  const handleRefreshClients = async () => {
    try {
      setLoading(true);
      
      // Create a base query
      let query = supabase
        .from("clients")
        .select(`
          *,
          users(full_name)
        `)
        .order("last_name", { ascending: true });
      
      // If user is a trainer, only fetch their assigned clients
      if (userRole === 'trainer' && user) {
        query = query.eq('assigned_to', user.id);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setClients(data || []);
      toast({
        title: "Aggiornato",
        description: "Elenco clienti aggiornato con successo",
      });
    } catch (error) {
      console.error("Error refreshing clients:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare l'elenco dei clienti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || 
           (client.email && client.email.toLowerCase().includes(query)) ||
           (client.phone && client.phone.includes(query));
  });

  const handleViewProfile = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          {userRole === 'trainer' ? 'I Miei Clienti' : 'Elenco Clienti'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cerca cliente..."
              className="pl-8 max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshClients}
            disabled={loading}
          >
            {loading ? "Caricamento..." : "Aggiorna"}
          </Button>
        </div>

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
      </CardContent>
    </Card>
  );
};

export default ClientList;
