
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreateCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleCreateCode: (role: string, expires: boolean, expireDays: number) => Promise<boolean>;
}

export function CreateCodeDialog({ 
  open, 
  onOpenChange, 
  handleCreateCode 
}: CreateCodeDialogProps) {
  const [newCodeRole, setNewCodeRole] = useState<string>("trainer");
  const [newCodeExpires, setNewCodeExpires] = useState<boolean>(true);
  const [expireDays, setExpireDays] = useState<number>(30);
  const [isCreating, setIsCreating] = useState(false);

  const onCreateCode = async () => {
    setIsCreating(true);
    const success = await handleCreateCode(newCodeRole, newCodeExpires, expireDays);
    setIsCreating(false);
    
    if (success) {
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setNewCodeRole("trainer");
    setNewCodeExpires(true);
    setExpireDays(30);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea Nuovo Codice di Registrazione</DialogTitle>
          <DialogDescription>
            Genera un codice di registrazione per il tuo staff
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Ruolo</Label>
            <Select
              value={newCodeRole}
              onValueChange={setNewCodeRole}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Seleziona un ruolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Amministratore</SelectItem>
                <SelectItem value="operator">Operatore</SelectItem>
                <SelectItem value="trainer">Trainer</SelectItem>
                <SelectItem value="assistant">Assistente</SelectItem>
                <SelectItem value="instructor">Istruttore</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="expires"
                checked={newCodeExpires}
                onCheckedChange={(checked) => setNewCodeExpires(!!checked)}
              />
              <Label htmlFor="expires">Imposta scadenza</Label>
            </div>
          </div>
          
          {newCodeExpires && (
            <div className="space-y-2">
              <Label htmlFor="expireDays">Giorni di validità</Label>
              <Input
                id="expireDays"
                type="number"
                min={1}
                value={expireDays}
                onChange={(e) => setExpireDays(parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={onCreateCode} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creazione...
              </>
            ) : (
              "Crea Codice"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
