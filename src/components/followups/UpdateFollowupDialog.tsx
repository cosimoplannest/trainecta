
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface Followup {
  id: string;
  client_id: string;
  sent_at: string;
  notes: string | null;
  outcome: string | null;
  client: {
    first_name: string;
    last_name: string;
  };
  trainer: {
    full_name: string;
  };
}

interface UpdateFollowupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followup: Followup | null;
  onUpdate: (followupId: string, outcome: string, notes: string) => void;
}

export function UpdateFollowupDialog({ 
  open, 
  onOpenChange, 
  followup, 
  onUpdate 
}: UpdateFollowupDialogProps) {
  const [outcome, setOutcome] = useState(followup?.outcome || "");
  const [notes, setNotes] = useState(followup?.notes || "");

  if (!followup) return null;

  const handleSubmit = () => {
    onUpdate(followup.id, outcome, notes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Follow-up per {followup.client.first_name} {followup.client.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Follow-up programmato per: {format(new Date(followup.sent_at), "d MMMM yyyy", { locale: it })}
            </p>
            <p className="text-sm text-muted-foreground">
              Trainer: {followup.trainer?.full_name || "Non assegnato"}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="outcome">Esito del follow-up</Label>
              <RadioGroup 
                value={outcome} 
                onValueChange={setOutcome}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="acquistato" id="acquistato" />
                  <Label htmlFor="acquistato" className="cursor-pointer">Acquistato</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non acquistato" id="non-acquistato" />
                  <Label htmlFor="non-acquistato" className="cursor-pointer">Non acquistato</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="da ricontattare" id="da-ricontattare" />
                  <Label htmlFor="da-ricontattare" className="cursor-pointer">Da ricontattare</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non risponde" id="non-risponde" />
                  <Label htmlFor="non-risponde" className="cursor-pointer">Non risponde</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="notes">Note</Label>
              <Textarea
                id="notes"
                value={notes || ""}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Inserisci note sul follow-up"
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!outcome}
          >
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
