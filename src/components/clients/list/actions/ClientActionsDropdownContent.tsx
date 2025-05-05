
import { Edit, UserCheck, Trash } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ClientData } from "../../types/client-types";

interface ClientActionsDropdownContentProps {
  client: ClientData;
}

export function ClientActionsDropdownContent({ client }: ClientActionsDropdownContentProps) {
  return (
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuLabel>Azioni</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Edit className="mr-2 h-4 w-4" />
        <span>Modifica</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <UserCheck className="mr-2 h-4 w-4" />
        <span>Assegna Trainer</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive">
        <Trash className="mr-2 h-4 w-4" />
        <span>Elimina</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
