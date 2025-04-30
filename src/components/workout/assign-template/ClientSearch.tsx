
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ClientSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export function ClientSearch({ 
  searchQuery, 
  setSearchQuery, 
  resultCount, 
  totalCount 
}: ClientSearchProps) {
  const showResultBadge = searchQuery.trim().length > 0 && resultCount !== undefined && totalCount !== undefined;
  
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="client-search">Cerca cliente</Label>
        {showResultBadge && (
          <Badge variant="outline" className="text-xs">
            {resultCount} risultati su {totalCount}
          </Badge>
        )}
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="client-search"
          type="text"
          placeholder="Cerca per nome..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      {searchQuery.trim().length > 0 && resultCount === 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Nessun cliente trovato con "{searchQuery}"
        </p>
      )}
    </div>
  );
}
