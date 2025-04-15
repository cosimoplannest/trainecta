
import { Ban } from "lucide-react";

export function EmptyUnavailabilityState() {
  return (
    <div className="bg-muted/50 flex flex-col items-center justify-center rounded-lg p-8 text-center">
      <Ban className="mb-2 h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-medium">Nessuna indisponibilità</h3>
      <p className="text-sm text-muted-foreground">
        Non hai registrato periodi di indisponibilità. Utilizza il pulsante "Segnala Indisponibilità" per registrarne uno.
      </p>
    </div>
  );
}
