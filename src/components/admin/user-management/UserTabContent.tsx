
import { UserWithRoleType } from "./types";
import { UserTable } from "./UserTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface UserTabContentProps {
  users: UserWithRoleType[];
  loading: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  emptyMessage: string;
}

export const UserTabContent = ({ 
  users, 
  loading, 
  icon: Icon, 
  title, 
  description, 
  emptyMessage 
}: UserTabContentProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <UserTable 
        users={users} 
        loading={loading} 
        emptyMessage={emptyMessage} 
      />
    </CardContent>
  </Card>
);
