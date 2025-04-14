
export interface Contract {
  id: string;
  name: string;
  description?: string;
  duration_days: number;
  price?: number;
  is_active: boolean;
  gym_id: string;
  created_at: string;
  updated_at: string;
}

export interface ContractFormData {
  name: string;
  description: string;
  type: string;
  price: string;
  duration: string;
  status: string;
}
