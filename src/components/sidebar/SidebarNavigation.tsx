
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  BarChart2, Dumbbell, Home, LineChart, MessageSquare, Users, Calendar, Clock, Ticket,
  UserCog, ShieldCheck, UserRound, Bell
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function SidebarNavigation() {
  const { userRole } = useAuth();

  // Define role-specific links
  const adminLinks = [
    { name: "Dashboard", href: "/dashboard/admin", icon: Home },
    { name: "Schede Allenamento", href: "/workout-templates", icon: Dumbbell },
    { name: "Gestione Clienti", href: "/client-management", icon: Users },
    { name: "Trainer", href: "/admin-settings?tab=user-management&role=trainers", icon: Dumbbell },
    { name: "Istruttori", href: "/admin-settings?tab=user-management&role=instructors", icon: Ticket },
    { name: "Assistenti", href: "/admin-settings?tab=user-management&role=assistants", icon: UserRound },
    { name: "Operatori", href: "/admin-settings?tab=user-management&role=operators", icon: UserCog },
    { name: "Statistiche", href: "/statistics", icon: BarChart2 },
    { name: "Monitoraggio & Analisi", href: "/tracking", icon: LineChart },
    { name: "Comunicazione", href: "/communications", icon: MessageSquare },
    { name: "Notifiche", href: "/notifications", icon: Bell },
    { name: "Impostazioni", href: "/admin-settings", icon: ShieldCheck }
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
    <nav className="space-y-1 p-2">
      {mainLinks.map((link) => (
        <TooltipProvider key={link.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 rounded-md py-2 text-sm font-medium transition-colors px-3",
                    isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/20" 
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                <span className="group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden">
                  {link.name}
                </span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
              {link.name}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  );
}
