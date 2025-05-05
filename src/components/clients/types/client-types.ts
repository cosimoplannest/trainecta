
export interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  joined_at: string | null;
  internal_notes: string | null;
  assigned_to: string | null;
  trainer?: { full_name: string } | null;
  status?: string;
  last_visit_date?: string | null;
  subscription_type?: string | null;
  preferred_time?: string | null;
  primary_goal?: string | null;
  fitness_level?: string | null;
  contact_method?: string | null;
  contact_time?: string | null;
}

export interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birth_date?: Date;
  internal_notes: string | null;
  preferred_time?: string | null;
  primary_goal?: string | null;
  fitness_level?: string | null;
  contact_method?: string | null;
  contact_time?: string | null;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}
