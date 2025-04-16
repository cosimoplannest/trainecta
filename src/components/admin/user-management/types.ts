
export type UserWithRoleType = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export interface UserManagementProps {
  initialRole?: string | null;
}
