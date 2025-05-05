
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ClientData } from "../types/client-types";

export function useClientList(itemsPerPage = 10) {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displaySearchQuery, setDisplaySearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  
  useEffect(() => {
    fetchClients();
  }, [toast, user, userRole]);

  useEffect(() => {
    // Reset to first page when search query changes
    setCurrentPage(1);
  }, [searchQuery]);

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

  const handleSearch = () => {
    setSearchQuery(displaySearchQuery);
  };

  const filteredClients = clients.filter(client => {
    if (!searchQuery.trim()) return true;
    
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || 
           (client.email && client.email.toLowerCase().includes(query)) ||
           (client.phone && client.phone.includes(query));
  });

  // Pagination logic
  const totalItems = filteredClients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Ensure current page is within bounds
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  
  // Get the current page items
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    clients,
    loading,
    searchQuery,
    setSearchQuery,
    displaySearchQuery,
    setDisplaySearchQuery,
    handleSearch,
    filteredClients,
    paginatedClients,
    handleRefreshClients,
    userRole,
    // Pagination
    currentPage: safeCurrentPage,
    totalPages,
    handlePageChange,
    totalItems
  };
}
