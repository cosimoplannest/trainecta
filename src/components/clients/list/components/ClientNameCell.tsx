
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ClientNameCellProps {
  firstName: string;
  lastName: string;
  joinedAt?: string | null;
}

export function ClientNameCell({ firstName, lastName, joinedAt }: ClientNameCellProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600', 
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600', 
      'bg-amber-100 text-amber-600', 
      'bg-rose-100 text-rose-600',
      'bg-sky-100 text-sky-600',
      'bg-emerald-100 text-emerald-600',
      'bg-indigo-100 text-indigo-600'
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className={getAvatarColor(`${firstName} ${lastName}`)}>
        <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">
          {firstName} {lastName}
        </div>
        {joinedAt && (
          <div className="text-xs text-muted-foreground">
            Cliente dal {format(new Date(joinedAt), "dd/MM/yyyy")}
          </div>
        )}
      </div>
    </div>
  );
}
