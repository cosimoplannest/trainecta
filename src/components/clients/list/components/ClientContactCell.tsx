
import { Mail, Phone } from "lucide-react";

interface ClientContactCellProps {
  email?: string | null;
  phone?: string | null;
}

export function ClientContactCell({ email, phone }: ClientContactCellProps) {
  return (
    <div className="space-y-1">
      {email && (
        <div className="flex items-center gap-1.5 text-sm">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate max-w-[180px]">{email}</span>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-1.5 text-sm">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{phone}</span>
        </div>
      )}
    </div>
  );
}
