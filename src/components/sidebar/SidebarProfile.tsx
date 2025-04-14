
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProfileProps {
  isCollapsed: boolean;
  loading: boolean;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
  } | null;
}

export function SidebarProfile({ isCollapsed, loading, profile }: SidebarProfileProps) {
  const { user, userRole } = useAuth();
  
  return (
    <div className="mb-5 flex items-center">
      {loading ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : (
        <Avatar className={cn("h-10 w-10", isCollapsed ? "mb-2" : "")}>
          <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
          <AvatarFallback>{profile?.full_name?.charAt(0) || user?.user_metadata?.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      )}
      
      {!isCollapsed && (
        <div className="ml-3 space-y-1 overflow-hidden">
          {loading ? (
            <>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </>
          ) : (
            <>
              <p className="text-sm font-medium truncate">{profile?.full_name || user?.user_metadata?.full_name || "Utente"}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email || user?.email}</p>
              {userRole && (
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full inline-block">
                  {userRole === 'admin' && "Amministratore"}
                  {userRole === 'operator' && "Operatore"}
                  {userRole === 'trainer' && "Trainer"}
                  {userRole === 'assistant' && "Assistente"}
                  {userRole === 'instructor' && "Istruttore"}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
