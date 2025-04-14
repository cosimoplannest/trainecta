
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  BarChart3,
  Users,
  Dumbbell,
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "../hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isOpen, setOpen] = useState(false);
  const { isMobile } = useMobile();
  const { pathname } = useLocation();

  const handleLogout = () => {
    console.log("Logout");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Gestione Clienti", href: "/client-management", icon: Users },
    { name: "Schede Allenamento", href: "/workout-templates", icon: Dumbbell },
    { name: "Statistiche", href: "/statistics", icon: BarChart3 },
    { name: "Impostazioni", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <nav
        className={cn(
          "bg-background z-30 flex flex-col h-screen border-r shadow-sm transition-all duration-300",
          isOpen ? "w-72" : "w-20",
          className
        )}
      >
        <div className="flex justify-end p-3 pb-2 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!isOpen)}
            className="rounded-full hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <ul className="space-y-2 p-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center p-2 rounded-lg transition-all group hover:bg-muted",
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3 shrink-0" />
                    <span
                      className={cn(
                        "whitespace-nowrap transition-opacity",
                        isOpen ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className={cn(
              "flex items-center w-full justify-start text-muted-foreground",
              isOpen ? "px-3" : "px-0 py-3 justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut
              className={cn(
                "h-5 w-5",
                isOpen ? "mr-2" : "mx-auto"
              )}
            />
            <span
              className={cn(
                "transition-opacity",
                isOpen ? "opacity-100" : "opacity-0"
              )}
            >
              Logout
            </span>
          </Button>
        </div>
      </nav>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-20"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
