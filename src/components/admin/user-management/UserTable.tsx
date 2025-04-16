
import { UserWithRoleType } from "./types";
import { UserStatusBadge } from "./UserStatusBadge";
import { Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface UserTableProps {
  users: UserWithRoleType[];
  loading: boolean;
  emptyMessage: string;
}

export const UserTable = ({ users, loading, emptyMessage }: UserTableProps) => {
  if (loading) {
    return <div className="flex justify-center p-6"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (users.length === 0) {
    return <div className="text-center text-muted-foreground p-6">{emptyMessage}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.full_name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell><UserStatusBadge status={user.status} /></TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Visualizza profilo">
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
