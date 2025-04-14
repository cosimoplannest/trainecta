
import { z } from "zod";

export const clientFormSchema = z.object({
  // Dati Anagrafici & Contatti
  first_name: z.string().min(1, "Il nome è richiesto"),
  last_name: z.string().min(1, "Il cognome è richiesto"),
  birth_date: z.date({ required_error: "La data di nascita è richiesta" }),
  gender: z.string({ required_error: "Il sesso è richiesto" }),
  fiscal_code: z.string().optional(),
  phone: z.string({ required_error: "Il numero di telefono è richiesto" }),
  email: z.string().email("Email non valida").optional().or(z.literal("")),
  address: z.string().optional(),
  
  // Abbonamento e Preferenze
  subscription_id: z.string().optional(),
  subscription_duration: z.string().optional(),
  subscription_start_date: z.date().optional(),
  subscription_end_date: z.date().optional(),
  preferred_time: z.string().optional(),
  primary_goal: z.string().optional(),
  fitness_level: z.string().optional(),
  
  // Altri campi esistenti
  source: z.string().optional(),
  assigned_to: z.string().optional(),
  internal_notes: z.string().optional(),
  joined_at: z.date(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;
