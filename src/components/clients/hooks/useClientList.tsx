
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ClientData } from "../types/client-types";
import { useDebounce } from "@/hooks/use-debounce";

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface ClientListParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  sortConfig?: SortConfig;
}

export function useClientList(initialParams: ClientListParams = {}) {
  const { 
    page: initialPage = 1, 
    pageSize: initialPageSize = 10, 
    searchQuery: initialSearchQuery = "", 
    sortConfig: initialSortConfig = { column: "last_name", direction: "asc" }
  } = initialParams;

  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [displaySearchQuery, setDisplaySearchQuery] = useState(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSortConfig);
  
  const { toast } = useToast();
  const { user, userRole } = useAuth();

  // Only search after user stops typing
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, pageSize, sortConfig]);

  // Main fetch function that handles server-side pagination, filtering, and sorting
  const fetchClients = async () => {
    try {
      setLoading(true);
      
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Base query with pagination
      let query = supabase
        .from("clients")
        .select(`
          *,
          users(full_name)
        `, { count: 'exact' });
      
      // Add console logs to debug the query
      console.log("Fetching clients with role:", userRole, "user ID:", user?.id);
      
      // Handle role-based restrictions
      if (userRole === 'trainer' && user) {
        query = query.eq('assigned_to', user.id);
      }
      
      // Handle search
      if (debouncedSearchQuery.trim()) {
        const searchTerm = `%${debouncedSearchQuery.toLowerCase()}%`;
        query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`);
      }
      
      // Handle sorting
      query = query.order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });
      
      // Apply pagination
      query = query.range(from, to);
      
      // Execute query
      const { data, error, count } = await query;

      console.log("Clients query result:", { data, error, count });

      if (error) throw error;
      
      setClients(data || []);
      if (count !== null) setTotalItems(count);
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

  // Load clients on mount and when dependencies change
  useEffect(() => {
    fetchClients();
  }, [debouncedSearchQuery, currentPage, pageSize, sortConfig, userRole, user?.id]);

  // Manual refresh function
  const handleRefreshClients = async () => {
    try {
      await fetchClients();
      toast({
        title: "Aggiornato",
        description: "Elenco clienti aggiornato con successo",
      });
    } catch (error) {
      console.error("Error refreshing clients:", error);
    }
  };

  const handleSearch = () => {
    setSearchQuery(displaySearchQuery);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sorting change
  const handleSortChange = (column: string) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return {
    clients,
    loading,
    totalItems,
    // Search
    searchQuery,
    setSearchQuery,
    displaySearchQuery,
    setDisplaySearchQuery,
    handleSearch,
    // Pagination
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    // Sorting
    sortConfig,
    handleSortChange,
    // Refresh
    handleRefreshClients,
    // User info
    userRole
  };
}
