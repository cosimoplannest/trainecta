
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesInputProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export function NotesInput({ notes, setNotes }: NotesInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="notes">Note</Label>
      <Textarea 
        id="notes" 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Note aggiuntive per questa assegnazione..."
      />
    </div>
  );
}
