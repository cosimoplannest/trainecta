
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, Dumbbell, FileText, Users, Calendar, MessageSquare, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart },
    { name: "Clienti", href: "/clients", icon: Users },
    { name: "Schede Allenamento", href: "/workout-templates", icon: Dumbbell },
    { name: "Questionari", href: "/questionnaires", icon: FileText },
    { name: "Pianificazione", href: "/schedule", icon: Calendar },
    { name: "Comunicazioni", href: "/communications", icon: MessageSquare },
    { name: "Impostazioni", href: "/settings", icon: Settings },
  ];

  if (isMobile) {
    return null;
  }

  return (
    <div className="bg-sidebar w-64 border-r flex flex-col h-full">
      <div className="flex items-center justify-center h-16 border-b">
        <div className="flex items-center">
          <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-8" />
        </div>
      </div>
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">UT</span>
          </div>
          <div>
            <p className="text-sm font-medium">Utente Trainer</p>
            <p className="text-xs text-muted-foreground">Personal Trainer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
