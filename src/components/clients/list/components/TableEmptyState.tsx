
import { Search, User } from "lucide-react";

interface TableEmptyStateProps {
  searchQuery: string;
}

export function TableEmptyState({ searchQuery }: TableEmptyStateProps) {
  const hasSearchQuery = searchQuery.trim().length > 0;
  
  return (
    <div className="rounded-md border mt-4 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-10">
        {hasSearchQuery ? (
          <>
            <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <span className="text-muted-foreground font-medium mb-1">
              Nessun risultato per "{searchQuery}"
            </span>
            <span className="text-xs text-muted-foreground">
              Prova a cercare con un altro nome, email o numero di telefono
            </span>
          </>
        ) : (
          <>
            <User className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <span className="text-muted-foreground">Nessun cliente trovato</span>
          </>
        )}
      </div>
    </div>
  );
}
