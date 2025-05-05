
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesInputProps {
  notes: string;
  onChange: (value: string) => void;
}

export const NotesInput = ({ notes, onChange }: NotesInputProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="notes">Note</Label>
      <Textarea
        id="notes"
        placeholder="Aggiungi note sull'assegnazione"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none"
      />
    </div>
  );
};
