
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  BarChart2, Dumbbell, Home, LineChart, MessageSquare, Users, Calendar, Clock, Ticket
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavigationProps {
  isCollapsed: boolean;
  isAdmin: boolean;
}

export function SidebarNavigation({ isCollapsed, isAdmin }: SidebarNavigationProps) {
  const { userRole } = useAuth();

  // Define role-specific links
  const adminLinks = [
    { name: "Dashboard", href: "/dashboard/admin", icon: Home },
    { name: "Schede Allenamento", href: "/workout-templates", icon: Dumbbell },
    { name: "Gestione Clienti", href: "/client-management", icon: Users },
    { name: "Statistiche", href: "/statistics", icon: BarChart2 },
    { name: "Monitoraggio & Analisi", href: "/tracking", icon: LineChart },
    { name: "Comunicazione", href: "/communications", icon: MessageSquare }
  ];

  const operatorLinks = [
    { name: "Dashboard", href: "/dashboard/operator", icon: Home },
    { name: "Gestione Clienti", href: "/client-management", icon: Users },
    { name: "Statistiche", href: "/statistics", icon: BarChart2 },
    { name: "Comunicazione", href: "/communications", icon: MessageSquare }
  ];

  const trainerLinks = [
    { name: "Dashboard", href: "/dashboard/trainer", icon: Home },
    { name: "Schede Allenamento", href: "/workout-templates", icon: Dumbbell },
    { name: "Gestione Clienti", href: "/client-management", icon: Users },
    { name: "Monitoraggio & Analisi", href: "/tracking", icon: LineChart },
    { name: "Comunicazione", href: "/communications", icon: MessageSquare }
  ];

  const assistantLinks = [
    { name: "Dashboard", href: "/dashboard/assistant", icon: Home },
    { name: "Turni Sala", href: "/dashboard/assistant?tab=schedule", icon: Clock },
    { name: "Membri", href: "/dashboard/assistant?tab=members", icon: Users },
    { name: "Indisponibilità", href: "/communications", icon: Calendar }
  ];

  const instructorLinks = [
    { name: "Dashboard", href: "/dashboard/instructor", icon: Home },
    { name: "Corsi", href: "/dashboard/instructor?tab=courses", icon: Ticket },
    { name: "Calendario", href: "/dashboard/instructor?tab=schedule", icon: Calendar },
    { name: "Indisponibilità", href: "/communications", icon: Calendar }
  ];

  // Determine which links to use based on user role
  let mainLinks = adminLinks;
  if (userRole === 'operator') {
    mainLinks = operatorLinks;
  } else if (userRole === 'trainer') {
    mainLinks = trainerLinks;
  } else if (userRole === 'assistant') {
    mainLinks = assistantLinks;
  } else if (userRole === 'instructor') {
    mainLinks = instructorLinks;
  }

  return (
    <nav className="space-y-1">
      {mainLinks.map((link) => (
        <TooltipProvider key={link.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 rounded-md py-2 text-sm font-medium transition-colors",
                    isCollapsed ? "justify-center px-2" : "px-3",
                    isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/20" 
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <link.icon className={cn("h-5 w-5", isCollapsed ? "flex-shrink-0" : "mr-2")} />
                {!isCollapsed && <span>{link.name}</span>}
              </NavLink>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                {link.name}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  );
}
