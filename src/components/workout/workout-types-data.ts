
import { WorkoutType } from "@/types/workout";

type WorkoutTypeOption = {
  value: WorkoutType;
  label: string;
};

export const workoutTypes: WorkoutTypeOption[] = [
  { value: "full_body", label: "Corpo intero" },
  { value: "upper_body", label: "Parte superiore" },
  { value: "lower_body", label: "Parte inferiore" },
  { value: "push", label: "Spinta" },
  { value: "pull", label: "Trazione" },
  { value: "legs", label: "Gambe" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
  { value: "circuit", label: "Circuito" },
  { value: "arms", label: "Braccia" },
  { value: "shoulders", label: "Spalle" },
  { value: "back", label: "Schiena" },
  { value: "chest", label: "Petto" }
];
