
import { Button } from "@/components/ui/button";

interface DialogFooterButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  loading: boolean;
  isSubmitDisabled: boolean;
}

export function DialogFooterButtons({ onCancel, onSubmit, loading, isSubmitDisabled }: DialogFooterButtonsProps) {
  return (
    <>
      <Button variant="outline" onClick={onCancel}>Annulla</Button>
      <Button onClick={onSubmit} disabled={loading || isSubmitDisabled}>
        {loading ? "Assegnazione..." : "Assegna"}
      </Button>
    </>
  );
}
