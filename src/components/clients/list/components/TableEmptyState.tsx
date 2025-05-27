
import { User, Search } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

interface TableEmptyStateProps {
  searchQuery?: string;
}

export function TableEmptyState({ searchQuery }: TableEmptyStateProps) {
  const showNoResults = searchQuery && searchQuery.trim().length > 0;

  if (showNoResults) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-10">
          <div className="flex flex-col items-center justify-center">
            <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <span className="text-muted-foreground font-medium mb-1">Nessun risultato per "{searchQuery}"</span>
            <span className="text-xs text-muted-foreground">Prova a cercare con un altro nome, email o numero di telefono</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-10">
        <div className="flex flex-col items-center justify-center">
          <User className="h-10 w-10 text-muted-foreground/50 mb-2" />
          <span className="text-muted-foreground">Nessun cliente trovato</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
