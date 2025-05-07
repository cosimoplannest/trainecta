
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
          href="/dashboard" 
          isActive={location.pathname === "/dashboard"}
          asChild
          tooltip="Dashboard"
        >
          <a href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          href="/clients" 
          isActive={isPathActive("/clients") || isPathActive("/client/")}
          asChild
          tooltip="Clienti"
        >
          <a href="/clients">
            <Users className="h-4 w-4" />
            <span>Clienti</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isTrainer && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            href="/workout-templates" 
            isActive={isPathActive("/workout-templates")}
            asChild
            tooltip="Schede"
          >
            <a href="/workout-templates">
              <Dumbbell className="h-4 w-4" />
              <span>Schede</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          href="/communications" 
          isActive={isPathActive("/communications")}
          asChild
          tooltip="Comunicazioni"
        >
          <a href="/communications">
            <MessageSquare className="h-4 w-4" />
            <span>Comunicazioni</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            href="/statistics" 
            isActive={isPathActive("/statistics")}
            asChild
            tooltip="Statistiche"
          >
            <a href="/statistics">
              <TrendingUp className="h-4 w-4" />
              <span>Statistiche</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          href="/gym-load" 
          isActive={isPathActive("/gym-load")}
          asChild
          tooltip="Carico Palestra"
        >
          <a href="/gym-load">
            <BarChart3 className="h-4 w-4" />
            <span>Carico Palestra</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            href="/tracking" 
            isActive={isPathActive("/tracking")}
            asChild
            tooltip="Presenze"
          >
            <a href="/tracking">
              <CalendarCheck className="h-4 w-4" />
              <span>Presenze</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          href="/settings" 
          isActive={isPathActive("/settings")}
          asChild
          tooltip="Impostazioni"
        >
          <a href="/settings">
            <Settings className="h-4 w-4" />
            <span>Impostazioni</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            href="/admin/settings" 
            isActive={isPathActive("/admin/settings")}
            asChild
            tooltip="Admin"
          >
            <a href="/admin/settings">
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
