
export interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birth_date: Date | undefined;
  internal_notes: string | null;
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
  };
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
