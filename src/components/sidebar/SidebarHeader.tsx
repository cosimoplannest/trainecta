
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, Menu } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className={cn(
      "flex items-center p-4 border-b", 
      isCollapsed ? "justify-center" : "justify-between"
    )}>
      {!isCollapsed && (
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Logo" className="h-8 w-8" />
          <span className="font-semibold">Trainecta</span>
        </Link>
      )}
      <Button variant="ghost" size="icon" onClick={onToggle} className="text-muted-foreground">
        {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>
    </div>
  );
}
