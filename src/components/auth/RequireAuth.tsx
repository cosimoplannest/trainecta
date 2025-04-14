
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
  requireApproval?: boolean;
}

const RequireAuth = ({ 
  children, 
  allowedRoles,
  requireApproval = true
}: RequireAuthProps) => {
  const { user, userRole, loading: authLoading } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user && requireApproval) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("status")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setIsApproved(data.status === 'active');
        } catch (error) {
          console.error("Error checking user status:", error);
          setIsApproved(true); // Default to approved on error to avoid locking users out
        }
      }
      setLoading(authLoading);
    };

    checkUserStatus();
  }, [authLoading, user, requireApproval]);

  if (loading) {
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

  // User is not approved yet
  if (requireApproval && !isApproved) {
    return <Navigate to="/dashboard" replace />;
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
