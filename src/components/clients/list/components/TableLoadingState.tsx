
import { TableRow, TableCell } from "@/components/ui/table";

export function TableLoadingState() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-10">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <span className="text-muted-foreground">Caricamento clienti...</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
