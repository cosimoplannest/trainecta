
import { RoomsList } from "./settings/RoomsList";
import { ClassesList } from "./settings/ClassesList";

export function GymLoadSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurazione Carico</h1>
        <p className="text-muted-foreground">
          Configura sale, corsi e parametri per il calcolo del carico della palestra
        </p>
      </div>

      <div className="grid gap-6">
        <RoomsList />
        <ClassesList />
      </div>
    </div>
  );
}
