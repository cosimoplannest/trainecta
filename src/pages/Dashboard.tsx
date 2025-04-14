
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userRole) {
      navigate(`/dashboard/${userRole}`);
    }
  }, [userRole, loading, navigate]);

  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default Dashboard;
