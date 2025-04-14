
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function SidebarHeader() {
  return (
    <div className="flex items-center py-4 px-4">
      <Link to="/" className="flex items-center space-x-2">
        <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Logo" className="h-8 w-8" />
        <span className="font-semibold hidden group-data-[state=expanded]:block">Trainecta</span>
      </Link>
    </div>
  );
}
