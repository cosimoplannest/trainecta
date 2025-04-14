
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function SidebarProfile() {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
  } | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, email')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        // Use the data from users table and fill in the avatar from user metadata
        setProfile({
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          avatar_url: user.user_metadata?.avatar_url
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  return (
    <div className="mb-5 flex items-center p-2">
      {loading ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : (
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
          <AvatarFallback>{profile?.full_name?.charAt(0) || user?.user_metadata?.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      )}
      
      <div className="ml-3 space-y-1 overflow-hidden group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden">
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
    </div>
  );
}
