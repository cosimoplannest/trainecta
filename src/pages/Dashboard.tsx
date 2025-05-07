
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlarmClock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

// Import dashboard components
import AdminDashboard from "./dashboards/AdminDashboard";
import TrainerDashboard from "./dashboards/TrainerDashboard";
import OperatorDashboard from "./dashboards/OperatorDashboard";
import InstructorDashboard from "./dashboards/InstructorDashboard";
import AssistantDashboard from "./dashboards/AssistantDashboard";

const Dashboard = () => {
  const { userRole, user, loading } = useAuth();
  const navigate = useNavigate();
  const [approvalPending, setApprovalPending] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (user && user.id) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("status")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setApprovalPending(data.status === 'pending_approval');
          setLoadingStatus(false);
        } catch (error) {
          console.error("Error checking approval status:", error);
          setLoadingStatus(false);
        }
      } else {
        setLoadingStatus(false);
      }
    };

    if (!loading) {
      checkApprovalStatus();
    }
  }, [user, loading]);

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

  // If not logged in, redirect to login page (this should be handled by RequireAuth)
  if (!user) {
    console.log("User not logged in, redirecting to login");
    navigate("/login", { replace: true });
    return null;
  }

  // If pending approval, show pending approval message
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

  // Render the appropriate dashboard based on the user role
  // Instead of redirecting, we render the appropriate dashboard component
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'operator':
      return <OperatorDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'assistant':
      return <AssistantDashboard />;
    default:
      return (
        <div className="flex h-full items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert>
              <AlertTitle>Ruolo non definito</AlertTitle>
              <AlertDescription>
                Il tuo account non ha ancora un ruolo assegnato. Contatta l'amministratore per assistenza.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
  }
};

export default Dashboard;
