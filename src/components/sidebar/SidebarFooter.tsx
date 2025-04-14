
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Settings, Shield, HelpCircle, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function SidebarFooter() {
  const { signOut, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (error) throw error;
        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, [user]);
  
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
    <div>
      <div className="mb-2 px-3">
        <p className="text-xs font-medium text-muted-foreground group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden">
          IMPOSTAZIONI
        </p>
      </div>
      <nav className="space-y-1 p-2">
        {secondaryLinks.map((link) => (
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

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to="/help"
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 rounded-md py-2 text-sm font-medium transition-colors px-3",
                    isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/20" 
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
                <span className="group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden">
                  Aiuto & Supporto
                </span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
              Aiuto & Supporto
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center w-full space-x-2 rounded-md py-2 text-sm font-medium transition-colors px-3 justify-start text-destructive hover:bg-destructive/10"
                )}
                onClick={signOut}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden">
                  Disconnetti
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
              Disconnetti
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </div>
  );
}
