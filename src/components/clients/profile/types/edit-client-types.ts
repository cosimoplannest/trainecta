
export interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birth_date: Date | undefined;
  internal_notes: string | null;
  // Additional fields for preferences
  preferred_time?: string | null;
  primary_goal?: string | null;
  fitness_level?: string | null;
  contact_method?: string | null;
  contact_time?: string | null;
}

export interface EditClientDialogProps {
  client: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    gender: string | null;
    birth_date: string | null;
    internal_notes: string | null;
    preferred_time?: string | null;
    primary_goal?: string | null;
    fitness_level?: string | null;
    contact_method?: string | null;
    contact_time?: string | null;
  };
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
