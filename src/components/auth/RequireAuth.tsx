
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setUserRole(data?.role || null);
      } catch (error) {
        console.error("Error fetching user role:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile verificare i tuoi permessi",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No role restrictions or user has allowed role
  if (!allowedRoles || !userRole || allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  // User is authenticated but doesn't have the required role
  toast({
    title: "Accesso negato",
    description: "Non hai i permessi per accedere a questa pagina",
    variant: "destructive",
  });

  // Redirect to appropriate dashboard based on role
  const dashboardPath = userRole ? `/dashboard/${userRole}` : "/dashboard";
  return <Navigate to={dashboardPath} replace />;
};

export default RequireAuth;
