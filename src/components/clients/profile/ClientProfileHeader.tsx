
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
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate("/client-management")}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {firstName} {lastName}
        </h2>
        <p className="text-muted-foreground">
          Cliente dal {joinedAt ? format(new Date(joinedAt), "d MMMM yyyy", { locale: it }) : "data non disponibile"}
        </p>
      </div>
    </div>
  );
};

export default ClientProfileHeader;
