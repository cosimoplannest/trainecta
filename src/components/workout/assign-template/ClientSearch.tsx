
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ClientSearch({ searchQuery, setSearchQuery }: ClientSearchProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="client-search">Cerca cliente</Label>
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
    </div>
  );
}
