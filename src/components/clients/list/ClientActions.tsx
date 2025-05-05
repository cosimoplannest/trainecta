
import { Edit, FileText, MoreHorizontal, Trash, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ClientData } from "../types/client-types";

interface ClientActionsProps {
  client: ClientData;
  handleViewProfile: (clientId: string) => void;
}

export function ClientActions({ client, handleViewProfile }: ClientActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleViewProfile(client.id)}
        className="h-8 px-2"
      >
        <FileText className="h-4 w-4 mr-1" />
        Profilo
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
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
      </DropdownMenu>
    </div>
  );
}
