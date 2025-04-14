
import React, { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, loading, userRole, userStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing errors when component mounts or email/password changes
    setError(null);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous errors

    try {
      if (!email || !password) {
        setError("Inserisci email e password.");
        setIsLoading(false);
        return;
      }

      // Log login attempt
      console.log(`Login attempt: ${email}`);

      await signIn(email, password);
      
      // If we get here without errors, the login was successful
      console.log("Login successful, waiting for auth state to update");
      
      // Note: We're not navigating here. The redirect will happen via the
      // useEffect below or the conditional render logic that follows
    } catch (err: any) {
      console.error("Login error in handleSubmit:", err);
      setError(err.message || "Si è verificato un errore durante l'accesso.");
    } finally {
      setIsLoading(false);
    }
  };

  // Log auth state for debugging
  useEffect(() => {
    console.log("Auth state in Login component:", { user, loading, userRole, userStatus });
  }, [user, loading, userRole, userStatus]);

  // If user is authenticated, redirect based on role
  if (!loading && user) {
    console.log("User is authenticated, redirecting...");
    
    // Redirect path based on status and role
    let redirectPath = "/dashboard";
    
    if (userStatus === 'pending_approval') {
      console.log("User pending approval, redirecting to dashboard");
    } else if (userRole) {
      console.log(`User has role ${userRole}, redirecting to dashboard/${userRole}`);
      redirectPath = `/dashboard/${userRole}`;
    } else {
      console.log("User authenticated but no role/status yet, redirecting to dashboard");
    }
    
    console.log(`Redirecting to: ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Accedi al tuo account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Inserisci i tuoi dati per accedere a Trainecta
          </p>
        </div>
        
        <div className="bg-card shadow-md rounded-lg p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Password dimenticata?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            
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
