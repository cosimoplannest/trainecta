
export interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  gender?: string;
  joined_at?: string;
  users?: {
    full_name: string;
  };
  assigned_to?: string;
  // New fields for client status tracking
  first_meeting_completed?: boolean;
  first_meeting_date?: string;
  purchase_type?: string | null;
  last_confirmation_date?: string | null;
  next_confirmation_due?: string | null;
}
