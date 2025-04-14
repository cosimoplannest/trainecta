
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, userRole, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to appropriate dashboard based on role if user is already logged in
    if (user && userRole) {
      navigate(`/dashboard/${userRole}`);
    } else if (user) {
      navigate("/dashboard");
    }
  }, [user, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await signIn(email, password);
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={userRole ? `/dashboard/${userRole}` : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Accedi</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Inserisci le tue credenziali per accedere alla piattaforma
          </p>
        </div>
        
        <div className="bg-card shadow-md rounded-lg p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Password dimenticata?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accesso in corso...
                </>
              ) : (
                "Accedi"
              )}
            </Button>
          </form>
          
          <div className="text-center text-sm">
            <p>
              Non hai un account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Registrati
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
