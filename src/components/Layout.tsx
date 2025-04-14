
import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import Header from "./Header";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {sidebarVisible && <Sidebar />}
      
      <div className={cn(
        "flex flex-col flex-1 overflow-hidden transition-all duration-300",
        sidebarVisible && !isMobile ? "ml-0" : "ml-0"
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
