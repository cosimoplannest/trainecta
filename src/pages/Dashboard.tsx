
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (userRole) {
        // Directly navigate to the role-specific dashboard
        navigate(`/dashboard/${userRole}`, { replace: true });
      } else {
        // If somehow a user with no role ends up here, redirect to login
        navigate("/login", { replace: true });
      }
    }
  }, [userRole, loading, navigate]);

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
