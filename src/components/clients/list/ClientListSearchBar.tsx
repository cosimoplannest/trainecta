
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientListSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleRefreshClients: () => void;
  loading: boolean;
}

export function ClientListSearchBar({ 
  searchQuery, 
  setSearchQuery, 
  handleRefreshClients, 
  loading 
}: ClientListSearchBarProps) {
  return (
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
  );
}
