
import { useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  MessageSquare, 
  Settings, 
  TrendingUp,
  CalendarCheck,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SidebarNavigation() {
  const location = useLocation();
  const { userRole } = useAuth();
  
  const isAdmin = userRole === "admin";
  const isTrainer = userRole === "trainer" || userRole === "admin";
  const isPathActive = (path: string) => location.pathname.startsWith(path);

  return (
    <SidebarMenu>
      <SidebarMenu.Item 
        href="/dashboard" 
        active={location.pathname === "/dashboard"}
        icon={<LayoutDashboard className="h-4 w-4" />}
      >
        Dashboard
      </SidebarMenu.Item>
      
      <SidebarMenu.Item 
        href="/clients" 
        active={isPathActive("/clients") || isPathActive("/client/")}
        icon={<Users className="h-4 w-4" />}
      >
        Clienti
      </SidebarMenu.Item>
      
      {isTrainer && (
        <SidebarMenu.Item 
          href="/workout-templates" 
          active={isPathActive("/workout-templates")}
          icon={<Dumbbell className="h-4 w-4" />}
        >
          Schede
        </SidebarMenu.Item>
      )}
      
      <SidebarMenu.Item 
        href="/communications" 
        active={isPathActive("/communications")}
        icon={<MessageSquare className="h-4 w-4" />}
      >
        Comunicazioni
      </SidebarMenu.Item>
      
      {isAdmin && (
        <SidebarMenu.Item 
          href="/statistics" 
          active={isPathActive("/statistics")}
          icon={<TrendingUp className="h-4 w-4" />}
        >
          Statistiche
        </SidebarMenu.Item>
      )}
      
      <SidebarMenu.Item 
        href="/gym-load" 
        active={isPathActive("/gym-load")}
        icon={<BarChart3 className="h-4 w-4" />}
      >
        Carico Palestra
      </SidebarMenu.Item>
      
      {isAdmin && (
        <SidebarMenu.Item 
          href="/tracking" 
          active={isPathActive("/tracking")}
          icon={<CalendarCheck className="h-4 w-4" />}
        >
          Presenze
        </SidebarMenu.Item>
      )}
      
      <SidebarMenu.Item 
        href="/settings" 
        active={isPathActive("/settings")}
        icon={<Settings className="h-4 w-4" />}
      >
        Impostazioni
      </SidebarMenu.Item>
      
      {isAdmin && (
        <SidebarMenu.Item 
          href="/admin/settings" 
          active={isPathActive("/admin/settings")}
          icon={<Settings className="h-4 w-4" />}
        >
          Admin
        </SidebarMenu.Item>
      )}
    </SidebarMenu>
  );
}
