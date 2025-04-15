
import { Megaphone } from "lucide-react";

export function EmptyBroadcastMessages() {
  return (
    <div className="bg-muted/50 flex flex-col items-center justify-center rounded-lg p-8 text-center">
      <Megaphone className="mb-2 h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-medium">Nessun messaggio broadcast</h3>
      <p className="text-sm text-muted-foreground">
        Non ci sono messaggi broadcast al momento. Crea un nuovo messaggio per comunicare con il team.
      </p>
    </div>
  );
}
