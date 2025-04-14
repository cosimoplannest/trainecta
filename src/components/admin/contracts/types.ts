
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

export interface ContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContractFormData) => Promise<void>;
  isEditing: boolean;
  initialData: ContractFormData;
  resetForm: () => void;
}

export interface ContractListProps {
  contracts: Contract[];
  loading: boolean;
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
}

export interface ContractType {
  value: string;
  label: string;
}

export interface DurationType {
  value: string;
  label: string;
}

export interface UseContractsResult {
  contracts: Contract[];
  loading: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  isEditing: boolean;
  formData: ContractFormData;
  resetForm: () => void;
  openEditDialog: (contract: Contract) => void;
  handleSubmit: (formData: ContractFormData) => Promise<void>;
  handleDeleteContract: (id: string) => Promise<void>;
}
