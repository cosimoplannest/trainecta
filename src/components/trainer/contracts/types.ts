
export interface ContractFile {
  id: string;
  trainer_id: string;
  gym_id: string;
  contract_type: 'collaboration' | 'vat_fixed_fee' | 'vat_percentage';
  start_date: string;
  end_date?: string | null;
  file_url?: string | null;
  notes?: string | null;
  monthly_fee?: number | null;
  percentage?: number | null;
  created_at: string;
  updated_at: string;
}

export interface InsuranceFile {
  id: string;
  trainer_id: string;
  gym_id: string;
  policy_number?: string | null;
  start_date: string;
  end_date: string;
  file_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainerContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainerId: string;
  contract?: ContractFile | null;
  onSuccess: () => void;
  isAdmin: boolean;
}

export interface TrainerInsuranceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainerId: string;
  insurance?: InsuranceFile | null;
  onSuccess: () => void;
}
