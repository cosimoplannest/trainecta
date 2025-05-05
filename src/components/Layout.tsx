
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent,
  SidebarHeader, 
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarProfile } from "./sidebar/SidebarProfile";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter as AppSidebarFooter } from "./sidebar/SidebarFooter";
import { SidebarHeader as AppSidebarHeader } from "./sidebar/SidebarHeader";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Effect to close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, navigate]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log("Layout: User not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
          <p className="text-muted-foreground">Caricamento in corso...</p>
        </div>
      </div>
    );
  }

  // Only render layout if user is authenticated
  if (!user) {
    return null; // Don't render anything as we'll redirect to login in the useEffect
  }

  return (
    <SidebarProvider defaultOpen={!isMobile} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar 
          variant={isMobile ? "floating" : "sidebar"} 
          collapsible={isMobile ? "offcanvas" : "icon"}
        >
          <SidebarHeader>
            <AppSidebarHeader />
          </SidebarHeader>
          
          <SidebarContent className="px-3 py-4">
            <SidebarProfile />
            <SidebarNavigation />
            
            <SidebarFooter className="mt-auto pt-4">
              <AppSidebarFooter />
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
          <Header />
          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 pb-20">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
