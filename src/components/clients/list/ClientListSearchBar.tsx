
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClientListSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleRefreshClients: () => void;
  loading: boolean;
  totalResults?: number;
  totalItems?: number;
}

export function ClientListSearchBar({ 
  searchQuery, 
  setSearchQuery, 
  handleRefreshClients, 
  loading,
  totalResults = 0,
  totalItems = 0
}: ClientListSearchBarProps) {
  // Mostra il conteggio dei risultati solo se c'è una query di ricerca
  const showResultCount = searchQuery.trim().length > 0;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca cliente per nome, email o telefono..."
            className="pl-9 pr-4 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefreshClients}
          disabled={loading}
          className="whitespace-nowrap"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Caricamento..." : "Aggiorna"}
        </Button>
      </div>
      
      {showResultCount && (
        <div className="flex items-center">
          <Badge variant="outline" className="text-xs font-normal">
            {totalResults} risultati trovati su {totalItems} clienti
          </Badge>
          {searchQuery.trim().length > 0 && totalResults === 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              Nessun cliente trovato con "{searchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}
