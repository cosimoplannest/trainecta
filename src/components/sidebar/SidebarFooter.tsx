
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Settings, Shield, HelpCircle, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarFooterProps {
  isCollapsed: boolean;
  isAdmin: boolean;
}

export function SidebarFooter({ isCollapsed, isAdmin }: SidebarFooterProps) {
  const { signOut } = useAuth();
  
  // Define secondary links (settings, admin, etc.)
  const secondaryLinks = [
    { name: "Impostazioni", href: "/settings", icon: Settings },
  ];

  if (isAdmin) {
    secondaryLinks.unshift({
      name: "Admin",
      href: "/admin-settings",
      icon: Shield,
    });
  }

  return (
    <div className="pt-4">
      <div className={cn(
        "mb-2",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {!isCollapsed && (
          <p className="text-xs font-medium text-muted-foreground">IMPOSTAZIONI</p>
        )}
      </div>
      <nav className="space-y-1">
        {secondaryLinks.map((link) => (
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

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to="/help"
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
                <HelpCircle className={cn("h-5 w-5", isCollapsed ? "flex-shrink-0" : "mr-2")} />
                {!isCollapsed && <span>Aiuto & Supporto</span>}
              </NavLink>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Aiuto & Supporto
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center w-full space-x-2 rounded-md py-2 text-sm font-medium transition-colors text-destructive hover:bg-destructive/10",
                  isCollapsed ? "justify-center px-2" : "px-3 justify-start"
                )}
                onClick={signOut}
              >
                <LogOut className={cn("h-5 w-5", isCollapsed ? "flex-shrink-0" : "mr-2")} />
                {!isCollapsed && <span>Disconnetti</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Disconnetti
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </nav>
    </div>
  );
}
