
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { SortConfig } from "../../hooks/useClientList";

interface SortableColumnHeaderProps {
  label: string;
  column: string;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
}

export function SortableColumnHeader({
  label,
  column,
  sortConfig,
  onSort
}: SortableColumnHeaderProps) {
  const isActive = sortConfig.column === column;
  const direction = sortConfig.direction;
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => onSort(column)} 
      className="p-0 h-auto font-medium"
    >
      {label}
      {isActive && (
        <ArrowUpDown 
          className={`ml-2 h-4 w-4 ${direction === 'desc' ? 'rotate-180' : ''}`} 
        />
      )}
    </Button>
  );
}
