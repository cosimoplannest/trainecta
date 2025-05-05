
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ProfileButtonProps {
  clientId: string;
  handleViewProfile: (clientId: string) => void;
}

export function ProfileButton({ clientId, handleViewProfile }: ProfileButtonProps) {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={() => handleViewProfile(clientId)}
      className="h-8 px-2"
    >
      <FileText className="h-4 w-4 mr-1" />
      Profilo
    </Button>
  );
}
