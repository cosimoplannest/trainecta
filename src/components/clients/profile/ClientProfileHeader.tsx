
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ClientProfileHeaderProps {
  firstName: string;
  lastName: string;
  joinedAt: string | null;
}

const ClientProfileHeader = ({ firstName, lastName, joinedAt }: ClientProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate("/client-management")}
        className="h-9 w-9 sm:h-10 sm:w-10 mb-2 sm:mb-0"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {firstName} {lastName}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Cliente dal {joinedAt ? format(new Date(joinedAt), "d MMMM yyyy", { locale: it }) : "data non disponibile"}
        </p>
      </div>
    </div>
  );
};

export default ClientProfileHeader;
