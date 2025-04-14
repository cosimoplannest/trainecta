
import { Link } from "react-router-dom";
import { ArrowLeft, Building, User, UserCog, Dumbbell, HeartPulse } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RegisterHeader } from "@/components/auth/RegisterHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [registrationCode, setRegistrationCode] = useState("");
  const navigate = useNavigate();

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationCode.trim()) {
      navigate(`/join/${registrationCode}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-4xl w-full space-y-8">
        <RegisterHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Join an existing gym */}
          <Card className="shadow-md border-primary/10 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Unisciti a una palestra</CardTitle>
              <CardDescription>
                Sei stato invitato a collaborare con una palestra?
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 flex-grow">
              <p className="text-sm text-muted-foreground">
                Se hai ricevuto un codice di registrazione, inseriscilo qui sotto per accedere alla registrazione specifica per il tuo ruolo.
              </p>
              
              <form onSubmit={handleSubmitCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationCode">Codice di registrazione</Label>
                  <Input 
                    id="registrationCode"
                    placeholder="Inserisci il codice qui"
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={!registrationCode.trim()}>
                  Continua
                </Button>
              </form>
              
              <div className="mt-6 space-y-2">
                <div className="text-sm font-medium">Ruoli del personale:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 text-sm p-2 bg-primary/5 rounded">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    <span>Trainer</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm p-2 bg-primary/5 rounded">
                    <UserCog className="h-4 w-4 text-primary" />
                    <span>Operatore</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm p-2 bg-primary/5 rounded">
                    <HeartPulse className="h-4 w-4 text-primary" />
                    <span>Istruttore</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm p-2 bg-primary/5 rounded">
                    <User className="h-4 w-4 text-primary" />
                    <span>Assistente</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Right side - Register a new gym */}
          <Card className="shadow-md border-primary/10 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Registra la tua palestra</CardTitle>
              <CardDescription>
                Sei il proprietario di una palestra e vuoi utilizzare Trainecta?
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 flex-grow">
              <p className="text-sm text-muted-foreground">
                Registra la tua palestra per iniziare a gestire clienti, trainer e schede di allenamento con Trainecta.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Amministratore Palestra</div>
                    <div className="text-sm text-muted-foreground">Gestisci tutti gli aspetti della tua palestra</div>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Gestione completa del personale</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Amministrazione clienti e contratti</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Statistiche e reportistica avanzata</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/gym-registration">
                  Registra la tua palestra
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Hai già un account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Accedi
            </Link>
          </p>
          
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
