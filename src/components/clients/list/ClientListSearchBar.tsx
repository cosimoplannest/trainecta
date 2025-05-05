
import { Search, RefreshCw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KeyboardEvent } from "react";

interface ClientListSearchBarProps {
  displaySearchQuery: string;
  setDisplaySearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleRefreshClients: () => void;
  loading: boolean;
  totalItems?: number;
  searchQuery: string;
}

export function ClientListSearchBar({ 
  displaySearchQuery, 
  setDisplaySearchQuery, 
  handleSearch,
  handleRefreshClients, 
  loading,
  totalItems = 0,
  searchQuery
}: ClientListSearchBarProps) {
  // Mostra il conteggio dei risultati solo se c'è una query di ricerca
  const showResultCount = searchQuery.trim().length > 0;
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cerca cliente per nome, email o telefono..."
              className="pl-9 pr-4 w-full"
              value={displaySearchQuery}
              onChange={(e) => setDisplaySearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={loading}
            className="whitespace-nowrap"
          >
            <Search className="h-4 w-4 mr-2" />
            Cerca
          </Button>
        </div>

        <div className="flex gap-2">
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
      </div>
      
      {showResultCount && (
        <div className="flex items-center">
          <Badge variant="outline" className="text-xs font-normal">
            {totalItems} clienti trovati
          </Badge>
          {searchQuery.trim().length > 0 && totalItems === 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              Nessun cliente trovato con "{searchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}
