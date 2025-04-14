
import {
  BarChart2,
  Dumbbell,
  Home,
  LineChart,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

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
  const { signOut } = useAuth();

  const mainLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Workout Templates",
      href: "/workout-templates",
      icon: Dumbbell,
    },
    {
      name: "Client Management",
      href: "/client-management",
      icon: Users,
    },
    {
      name: "Statistics",
      href: "/statistics",
      icon: BarChart2,
    },
    {
      name: "Tracking & Analysis",
      href: "/tracking",
      icon: LineChart,
    }
  ];

  const secondaryLinks = [
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full max-w-60 flex-col border-r bg-secondary">
      <ScrollArea className="flex-1 space-y-4 p-4">
        <div className="flex flex-col items-center space-y-2">
          {loading ? (
            <Skeleton className="h-12 w-12 rounded-full" />
          ) : (
            <Avatar>
              <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
              <AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          {loading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <p className="text-sm font-semibold">{profile?.full_name}</p>
          )}
          {loading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              My Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline ${
                  isActive ? "bg-accent text-accent-foreground" : ""
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
        <div className="mt-4 space-y-1">
          {secondaryLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline ${
                  isActive ? "bg-accent text-accent-foreground" : ""
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
