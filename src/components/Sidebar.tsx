import {
  BarChart2,
  Dumbbell,
  Home,
  LineChart,
  MessageSquare,
  Settings,
  Shield,
  Users,
  Calendar,
  Clock,
  Ticket,
  Menu,
  ChevronLeft,
  Bell,
  LogOut,
  HelpCircle,
  Search,
} from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  loading?: boolean;
  profile?: {
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
  } | null;
}

export function Sidebar({ loading = false, profile = null }: SidebarProps) {
  const { signOut, user, userRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

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

    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [user, location.pathname]);

  const adminLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/admin",
      icon: Home,
    },
    {
      name: "Schede Allenamento",
      href: "/workout-templates",
      icon: Dumbbell,
    },
    {
      name: "Gestione Clienti",
      href: "/client-management",
      icon: Users,
    },
    {
      name: "Statistiche",
      href: "/statistics",
      icon: BarChart2,
    },
    {
      name: "Monitoraggio & Analisi",
      href: "/tracking",
      icon: LineChart,
    },
    {
      name: "Comunicazione",
      href: "/communications",
      icon: MessageSquare,
    }
  ];

  const operatorLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/operator",
      icon: Home,
    },
    {
      name: "Gestione Clienti",
      href: "/client-management",
      icon: Users,
    },
    {
      name: "Statistiche",
      href: "/statistics",
      icon: BarChart2,
    },
    {
      name: "Comunicazione",
      href: "/communications",
      icon: MessageSquare,
    }
  ];

  const trainerLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/trainer",
      icon: Home,
    },
    {
      name: "Schede Allenamento",
      href: "/workout-templates",
      icon: Dumbbell,
    },
    {
      name: "Gestione Clienti",
      href: "/client-management",
      icon: Users,
    },
    {
      name: "Monitoraggio & Analisi",
      href: "/tracking",
      icon: LineChart,
    },
    {
      name: "Comunicazione",
      href: "/communications",
      icon: MessageSquare,
    }
  ];

  const assistantLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/assistant",
      icon: Home,
    },
    {
      name: "Turni Sala",
      href: "/dashboard/assistant?tab=schedule",
      icon: Clock,
    },
    {
      name: "Membri",
      href: "/dashboard/assistant?tab=members",
      icon: Users,
    },
    {
      name: "Indisponibilità",
      href: "/communications",
      icon: Calendar,
    }
  ];

  const instructorLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/instructor",
      icon: Home,
    },
    {
      name: "Corsi",
      href: "/dashboard/instructor?tab=courses",
      icon: Ticket,
    },
    {
      name: "Calendario",
      href: "/dashboard/instructor?tab=schedule",
      icon: Calendar,
    },
    {
      name: "Indisponibilità",
      href: "/communications",
      icon: Calendar,
    }
  ];

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

  const secondaryLinks = [
    {
      name: "Impostazioni",
      href: "/settings",
      icon: Settings,
    },
  ];

  if (isAdmin) {
    secondaryLinks.unshift({
      name: "Admin",
      href: "/admin-settings",
      icon: Shield,
    });
  }

  const sidebarClass = cn(
    "flex flex-col border-r bg-secondary transition-all duration-300",
    isCollapsed ? "w-16" : "w-64",
    isMobile ? (
      isMobileSidebarOpen 
        ? "fixed inset-y-0 left-0 z-50 shadow-xl" 
        : "hidden"
    ) : "h-screen"
  );

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const MobileOverlay = () => (
    isMobile && isMobileSidebarOpen && (
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={() => setIsMobileSidebarOpen(false)}
      />
    )
  );

  const MobileToggle = () => (
    isMobile && !isMobileSidebarOpen && (
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 rounded-full bg-primary text-primary-foreground shadow-md"
        onClick={() => setIsMobileSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    )
  );

  return (
    <>
      <MobileOverlay />
      <MobileToggle />

      <div className={sidebarClass}>
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
          <Button variant="ghost" size="icon" onClick={handleToggleSidebar} className="text-muted-foreground">
            {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          {!isCollapsed && (
            <div className="relative mb-6 px-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cerca..." 
                className="w-full pl-9 pr-4 h-9 bg-muted/50 hover:bg-muted/80 focus:bg-muted/80 transition-colors"
              />
            </div>
          )}
          
          <div className="mb-5 flex items-center">
            {loading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <Avatar className={cn("h-10 w-10", isCollapsed ? "mb-2" : "")}>
                <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
                <AvatarFallback>{profile?.full_name?.charAt(0) || user?.user_metadata?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            )}
            
            {!isCollapsed && (
              <div className="ml-3 space-y-1 overflow-hidden">
                {loading ? (
                  <>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium truncate">{profile?.full_name || user?.user_metadata?.full_name || "Utente"}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile?.email || user?.email}</p>
                    {userRole && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full inline-block">
                        {userRole === 'admin' && "Amministratore"}
                        {userRole === 'operator' && "Operatore"}
                        {userRole === 'trainer' && "Trainer"}
                        {userRole === 'assistant' && "Assistente"}
                        {userRole === 'instructor' && "Istruttore"}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
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
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
