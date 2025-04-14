
import { Bell, Menu, User, MessageSquare, Settings, LogOut, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Header = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nuova registrazione", message: "Un nuovo cliente si è registrato", time: "5 min fa", read: false },
    { id: 2, title: "Appuntamento", message: "Appuntamento con Mario Rossi alle 15:00", time: "1 ora fa", read: false },
    { id: 3, title: "Aggiornamento sistema", message: "Il sistema è stato aggiornato alla versione 2.5", time: "5 ore fa", read: true },
  ]);

  // Determine page title based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard/admin")) setPageTitle("Dashboard Admin");
    else if (path.includes("/dashboard/operator")) setPageTitle("Dashboard Operatore");
    else if (path.includes("/dashboard/trainer")) setPageTitle("Dashboard Trainer");
    else if (path.includes("/dashboard/assistant")) setPageTitle("Dashboard Assistente");
    else if (path.includes("/dashboard/instructor")) setPageTitle("Dashboard Istruttore");
    else if (path.includes("/workout-templates")) setPageTitle("Schede Allenamento");
    else if (path.includes("/client-management")) setPageTitle("Gestione Clienti");
    else if (path.includes("/statistics")) setPageTitle("Statistiche");
    else if (path.includes("/tracking")) setPageTitle("Tracking");
    else if (path.includes("/communications")) setPageTitle("Comunicazioni");
    else if (path.includes("/settings")) setPageTitle("Impostazioni");
    else if (path.includes("/admin-settings")) setPageTitle("Impostazioni Admin");
    else setPageTitle("Dashboard");
  }, [location]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <header className="sticky top-0 z-10 border-b px-4 py-2 flex items-center justify-between bg-background shadow-sm">
      <div className="flex items-center space-x-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <h1 className="text-xl font-semibold text-foreground hidden sm:block">{pageTitle}</h1>
      </div>
      
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca..." 
            className="w-full pl-8 pr-4 h-9 bg-muted/30 hover:bg-muted/50 focus:bg-background transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" aria-label="Cerca" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" asChild>
          <Link to="/help" aria-label="Aiuto">
            <HelpCircle className="h-5 w-5" />
          </Link>
        </Button>
        
        <Button variant="ghost" size="icon" asChild>
          <Link to="/communications" aria-label="Messaggi">
            <MessageSquare className="h-5 w-5" />
          </Link>
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Notifiche</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                  Segna tutte come lette
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-auto divide-y">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-muted/50 transition-colors ${notification.read ? '' : 'bg-primary/5'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Nessuna notifica
                </div>
              )}
            </div>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link to="/notifications">Vedi tutte le notifiche</Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="Avatar" />
                <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilo</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Impostazioni</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnetti</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
