
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="text-center space-y-6 px-4">
        <div className="flex items-center justify-center mb-6">
          <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-20" />
        </div>
        <h1 className="text-7xl font-extrabold tracking-tight text-primary">404</h1>
        <h2 className="text-2xl font-bold">Pagina non trovata</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button>Torna alla Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
