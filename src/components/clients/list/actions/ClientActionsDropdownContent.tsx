
import { Edit, UserCheck, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ClientData } from "../../types/client-types";
import { AssignTrainer } from "../../AssignTrainer";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface ClientActionsDropdownContentProps {
  client: ClientData;
}

export function ClientActionsDropdownContent({ client }: ClientActionsDropdownContentProps) {
  const navigate = useNavigate();
  const { toast: hookToast } = useToast();
  const [isAssignTrainerOpen, setIsAssignTrainerOpen] = useState(false);
  
  const handleEdit = () => {
    navigate(`/client/${client.id}`);
  };
  
  const handleAssignTrainer = () => {
    setIsAssignTrainerOpen(true);
  };
  
  const handleDelete = async () => {
    if (confirm(`Sei sicuro di voler eliminare ${client.first_name} ${client.last_name}?`)) {
      try {
        const { error } = await supabase
          .from("clients")
          .delete()
          .eq("id", client.id);
          
        if (error) throw error;
        
        toast.success("Cliente eliminato con successo");
      } catch (error) {
        console.error("Error deleting client:", error);
        hookToast({
          title: "Errore",
          description: "Impossibile eliminare il cliente",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuLabel>Azioni</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleEdit}>
        <Edit className="mr-2 h-4 w-4" />
        <span>Modifica</span>
      </DropdownMenuItem>
      <Dialog open={isAssignTrainerOpen} onOpenChange={setIsAssignTrainerOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onClick={handleAssignTrainer} onSelect={(e) => e.preventDefault()}>
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Assegna Trainer</span>
          </DropdownMenuItem>
        </DialogTrigger>
        {isAssignTrainerOpen && (
          <AssignTrainer 
            clientId={client.id} 
            currentTrainerId={client.assigned_to}
            onAssigned={() => toast.success("Trainer assegnato con successo")}
          />
        )}
      </Dialog>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
        <Trash className="mr-2 h-4 w-4" />
        <span>Elimina</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
