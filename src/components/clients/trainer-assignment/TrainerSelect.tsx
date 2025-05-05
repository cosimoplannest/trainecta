
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Trainer {
  id: string;
  name: string;
}

interface TrainerSelectProps {
  trainers: Trainer[];
  selectedTrainer: string;
  onSelect: (value: string) => void;
}

export const TrainerSelect = ({ trainers, selectedTrainer, onSelect }: TrainerSelectProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="trainer">Seleziona Trainer</Label>
      <Select value={selectedTrainer} onValueChange={onSelect}>
        <SelectTrigger id="trainer">
          <SelectValue placeholder="Seleziona un trainer" />
        </SelectTrigger>
        <SelectContent>
          {trainers.map((trainer) => (
            <SelectItem key={trainer.id} value={trainer.id}>
              {trainer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
