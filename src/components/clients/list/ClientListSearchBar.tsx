
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientListSearchBarProps {
  displaySearchQuery: string;
  setDisplaySearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleRefreshClients: () => void;
  loading: boolean;
  totalItems: number;
  searchQuery: string;
}

export function ClientListSearchBar({
  displaySearchQuery,
  setDisplaySearchQuery,
  handleSearch,
  handleRefreshClients,
  loading,
  totalItems,
  searchQuery
}: ClientListSearchBarProps) {
  const isMobile = useIsMobile();
  const [isFocused, setIsFocused] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row items-center justify-between'}`}>
      <div className={`relative ${isMobile ? 'w-full' : 'w-80'}`}>
        <div className={`flex items-center rounded-md border ${isFocused ? 'ring-2 ring-ring ring-offset-1' : ''} overflow-hidden`}>
          <Input
            type="text"
            placeholder="Cerca cliente..."
            value={displaySearchQuery}
            onChange={(e) => setDisplaySearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            onClick={handleSearch}
            className="h-9 px-3"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className={`flex ${isMobile ? 'justify-between' : 'gap-2 items-center'}`}>
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            {totalItems} risultati per "{searchQuery}"
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshClients}
          disabled={loading}
          className="h-9"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span>Aggiorna</span>
        </Button>
      </div>
    </div>
  );
}
