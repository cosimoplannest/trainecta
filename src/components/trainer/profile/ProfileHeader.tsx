
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
}

export const ProfileHeader = ({ fullName, email }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate("/admin-settings?tab=user-management&role=trainers")}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {fullName}
        </h2>
        <p className="text-muted-foreground">
          Trainer - {email}
        </p>
      </div>
    </div>
  );
};
