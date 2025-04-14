
import { ReactNode } from "react";
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

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar variant="sidebar" collapsible="icon">
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
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
