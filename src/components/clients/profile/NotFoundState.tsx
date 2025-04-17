
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NotFoundState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-xl font-semibold mb-2">Cliente non trovato</h3>
      <p className="text-muted-foreground mb-4">Il cliente richiesto non è stato trovato.</p>
      <Button onClick={() => navigate("/client-management")}>
        Torna alla lista clienti
      </Button>
    </div>
  );
};
