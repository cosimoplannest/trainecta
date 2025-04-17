
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ClientData } from "../types/client-types";

export function useClientList() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  
  useEffect(() => {
    fetchClients();
  }, [toast, user, userRole]);

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

  return {
    clients,
    loading,
    searchQuery,
    setSearchQuery,
    filteredClients,
    handleRefreshClients,
    userRole
  };
}
