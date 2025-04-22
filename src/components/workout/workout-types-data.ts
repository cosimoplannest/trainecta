
import { WorkoutType } from "@/types/workout";

type WorkoutTypeOption = {
  value: WorkoutType;
  label: string;
};

export const workoutTypes: WorkoutTypeOption[] = [
  { value: "full_body", label: "Full body" },
  { value: "upper_body", label: "Upper body" },
  { value: "lower_body", label: "Lower body" },
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "legs", label: "Gambe" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
  { value: "circuit", label: "Circuito" },
  { value: "arms", label: "Braccia" },
  { value: "shoulders", label: "Spalle" },
  { value: "back", label: "Schiena" },
  { value: "chest", label: "Petto" }
];
