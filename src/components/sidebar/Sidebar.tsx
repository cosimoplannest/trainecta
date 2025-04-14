
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarProfile } from "./SidebarProfile";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
  } | null>(null);

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
  }, [user, location.pathname, isMobile]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const sidebarClass = cn(
    "flex flex-col border-r bg-secondary transition-all duration-300",
    isCollapsed ? "w-16" : "w-64",
    isMobile ? (
      isMobileSidebarOpen 
        ? "fixed inset-y-0 left-0 z-50 shadow-xl" 
        : "hidden"
    ) : "h-screen"
  );

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
        <SidebarHeader isCollapsed={isCollapsed} onToggle={handleToggleSidebar} />
        
        <ScrollArea className="flex-1 px-3 py-4">
          {!isCollapsed && (
            <div className="relative mb-6 px-1">
              <input 
                placeholder="Cerca..." 
                className="w-full pl-9 pr-4 h-9 bg-muted/50 hover:bg-muted/80 focus:bg-muted/80 transition-colors rounded-md"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
          
          <SidebarProfile 
            isCollapsed={isCollapsed} 
            loading={loading} 
            profile={profile} 
          />

          <div className="space-y-4">
            <SidebarNavigation isCollapsed={isCollapsed} isAdmin={isAdmin} />
            
            <SidebarFooter isCollapsed={isCollapsed} isAdmin={isAdmin} />
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
