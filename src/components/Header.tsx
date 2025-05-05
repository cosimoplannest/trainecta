import { Menu, User, MessageSquare, Settings, LogOut, Search, HelpCircle, Bell } from "lucide-react";
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
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useSidebar } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Header = () => {
  const isMobile = useIsMobile();
  const [searchVisible, setSearchVisible] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  const { toggleSidebar } = useSidebar();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-10 border-b px-3 sm:px-4 py-2 flex items-center justify-between bg-background shadow-sm">
      <div className="flex items-center space-x-2 sm:space-x-4">
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        ) : null}
        
        <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate max-w-[180px] sm:max-w-full">{pageTitle}</h1>
      </div>
      
      {!isMobile && (
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cerca..." 
              className="w-full pl-8 pr-4 h-9 bg-muted/30 hover:bg-muted/50 focus:bg-background transition-colors"
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-1 sm:space-x-2">
        {isMobile && (
          <>
            <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
              <SheetContent side="top" className="h-20 pt-10">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cerca..." 
                    className="w-full pl-8 pr-4 bg-muted/30"
                    autoFocus
                  />
                </div>
              </SheetContent>
              
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Cerca" 
                className="h-9 w-9" 
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </Sheet>
          </>
        )}
        
        <Button variant="ghost" size="icon" asChild className="h-9 w-9 hidden sm:flex">
          <Link to="/help" aria-label="Aiuto">
            <HelpCircle className="h-5 w-5" />
          </Link>
        </Button>
        
        <Button variant="ghost" size="icon" asChild className="h-9 w-9 hidden sm:flex">
          <Link to="/communications" aria-label="Messaggi">
            <MessageSquare className="h-5 w-5" />
          </Link>
        </Button>
        
        <NotificationCenter />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
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
              {isMobile && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/communications">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Messaggi</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/help">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Aiuto</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
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
