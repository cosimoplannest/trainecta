
import { useAuth } from "@/hooks/use-auth";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ClientProfileHeaderProps {
  firstName: string;
  lastName: string;
  joinedAt: string;
  isAssigned?: boolean;
  assignedToCurrentUser?: boolean;
  purchaseType?: string | null;
  firstMeetingCompleted?: boolean;
}

const ClientProfileHeader = ({ 
  firstName, 
  lastName, 
  joinedAt,
  isAssigned = false,
  assignedToCurrentUser = false,
  purchaseType = null,
  firstMeetingCompleted = false
}: ClientProfileHeaderProps) => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const isTrainer = userRole === 'trainer';
  
  const getPurchaseBadge = () => {
    if (!firstMeetingCompleted) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          In attesa del primo incontro
        </Badge>
      );
    }
    
    if (purchaseType === 'package') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Pacchetto lezioni
        </Badge>
      );
    } else if (purchaseType === 'custom_plan') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Scheda personalizzata
        </Badge>
      );
    } else if (purchaseType === 'none') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Nessun acquisto
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="pb-4 border-b">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/client-management")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {firstName} {lastName}
            </h2>
            {isTrainer && (
              isAssigned ? (
                assignedToCurrentUser ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Assegnato a te
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Assegnato ad altro trainer
                  </Badge>
                )
              ) : null
            )}
            {getPurchaseBadge()}
          </div>
          <p className="text-muted-foreground">
            Cliente dal {format(new Date(joinedAt), "d MMMM yyyy", { locale: it })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileHeader;
