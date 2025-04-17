
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
}
