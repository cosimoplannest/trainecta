
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlarmClock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { userRole, user, loading } = useAuth();
  const navigate = useNavigate();
  const [approvalPending, setApprovalPending] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (user && userRole) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("status")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setApprovalPending(data.status === 'pending_approval');
        } catch (error) {
          console.error("Error checking approval status:", error);
        } finally {
          setLoadingStatus(false);
        }
      } else {
        setLoadingStatus(false);
      }
    };

    if (!loading) {
      checkApprovalStatus();
    }
  }, [user, userRole, loading]);

  useEffect(() => {
    if (!loading && !loadingStatus) {
      if (approvalPending) {
        // User is registered but pending approval
        // Stay on this page with the approval pending message
      } else if (userRole) {
        // User has a role and is approved, navigate to role-specific dashboard
        navigate(`/dashboard/${userRole}`, { replace: true });
      } else if (user) {
        // User is logged in but has no role (edge case)
        navigate("/login", { replace: true });
      } else {
        // Not logged in
        navigate("/login", { replace: true });
      }
    }
  }, [userRole, loading, navigate, loadingStatus, approvalPending, user]);

  if (loading || loadingStatus) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Caricamento in corso...</p>
        </div>
      </div>
    );
  }

  if (approvalPending) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlarmClock className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800 text-lg font-medium">Approvazione in attesa</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Il tuo account è stato registrato con successo, ma è in attesa di approvazione da parte dell'amministratore.
              Riceverai una notifica via email quando il tuo account sarà stato approvato.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // This should not be visible as we redirect in the useEffect
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Reindirizzamento in corso...</p>
      </div>
    </div>
  );
};

export default Dashboard;
