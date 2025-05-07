
import { useLocation } from "react-router-dom";
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
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function SidebarNavigation() {
  const location = useLocation();
  const { userRole } = useAuth();
  
  const isAdmin = userRole === "admin";
  const isTrainer = userRole === "trainer" || userRole === "admin";
  const isPathActive = (path: string) => location.pathname.startsWith(path);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          isActive={location.pathname === "/dashboard"}
          asChild
          tooltip="Dashboard"
        >
          <Link to="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          isActive={isPathActive("/clients") || isPathActive("/client/")}
          asChild
          tooltip="Clienti"
        >
          <Link to="/clients">
            <Users className="h-4 w-4" />
            <span>Clienti</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isTrainer && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={isPathActive("/workout-templates")}
            asChild
            tooltip="Schede"
          >
            <Link to="/workout-templates">
              <Dumbbell className="h-4 w-4" />
              <span>Schede</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          isActive={isPathActive("/communications")}
          asChild
          tooltip="Comunicazioni"
        >
          <Link to="/communications">
            <MessageSquare className="h-4 w-4" />
            <span>Comunicazioni</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={isPathActive("/statistics")}
            asChild
            tooltip="Statistiche"
          >
            <Link to="/statistics">
              <TrendingUp className="h-4 w-4" />
              <span>Statistiche</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          isActive={isPathActive("/gym-load")}
          asChild
          tooltip="Carico Palestra"
        >
          <Link to="/gym-load">
            <BarChart3 className="h-4 w-4" />
            <span>Carico Palestra</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={isPathActive("/tracking")}
            asChild
            tooltip="Presenze"
          >
            <Link to="/tracking">
              <CalendarCheck className="h-4 w-4" />
              <span>Presenze</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          isActive={isPathActive("/settings")}
          asChild
          tooltip="Impostazioni"
        >
          <Link to="/settings">
            <Settings className="h-4 w-4" />
            <span>Impostazioni</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            isActive={isPathActive("/admin/settings")}
            asChild
            tooltip="Admin"
          >
            <Link to="/admin/settings">
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
