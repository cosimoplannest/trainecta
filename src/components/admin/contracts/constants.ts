
import { ContractType, DurationType } from "./types";

export const contractTypes: ContractType[] = [
  { value: "subscription", label: "Abbonamento" },
  { value: "trial", label: "Prova Gratuita" },
  { value: "package", label: "Pacchetto" },
  { value: "promotion", label: "Promozione" }
];

export const durations: DurationType[] = [
  { value: "30", label: "1 Mese" },
  { value: "90", label: "3 Mesi" },
  { value: "180", label: "6 Mesi" },
  { value: "365", label: "12 Mesi" },
  { value: "custom", label: "Personalizzato" }
];
