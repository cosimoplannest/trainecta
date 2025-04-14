
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, User, UserCog, Dumbbell, HeartPulse } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const JoinWithCode = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [gymName, setGymName] = useState<string | null>(null);

  useEffect(() => {
    const validateCode = async () => {
      if (!code) {
        setIsLoading(false);
        return;
      }

      try {
        // Get gym ID from the registration code
        const { data: gymId, error: gymError } = await supabase.rpc('get_gym_id_from_code', {
          registration_code: code
        });

        if (gymError || !gymId) {
          toast.error("Codice di registrazione non valido o scaduto");
          setIsLoading(false);
          setIsValid(false);
          return;
        }

        // Get role from the registration code
        const { data: roleData, error: roleError } = await supabase.rpc('get_role_from_code', {
          registration_code: code
        });

        if (roleError || !roleData) {
          toast.error("Errore nella verifica del ruolo");
          setIsLoading(false);
          setIsValid(false);
          return;
        }

        // Get gym name
        const { data: gymData, error: gymNameError } = await supabase
          .from('gyms')
          .select('name')
          .eq('id', gymId)
          .single();

        if (gymNameError) {
          console.error("Error fetching gym name:", gymNameError);
        } else {
          setGymName(gymData.name);
        }

        setRole(roleData);
        setIsValid(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error validating code:", error);
        toast.error("Errore nella verifica del codice");
        setIsLoading(false);
        setIsValid(false);
      }
    };

    validateCode();
  }, [code]);

  const getRoleNameInItalian = (role: string): string => {
    switch (role) {
      case 'trainer': return 'Trainer';
      case 'operator': return 'Operatore';
      case 'assistant': return 'Assistente';
      case 'instructor': return 'Istruttore';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'trainer':
        return <Dumbbell className="h-6 w-6 text-primary" />;
      case 'operator':
        return <UserCog className="h-6 w-6 text-primary" />;
      case 'assistant':
        return <User className="h-6 w-6 text-primary" />;
      case 'instructor':
        return <HeartPulse className="h-6 w-6 text-primary" />;
      default:
        return <User className="h-6 w-6 text-primary" />;
    }
  };

  const getRegistrationPath = (role: string): string => {
    switch (role) {
      case 'trainer':
        return `/trainer-registration/${code}`;
      case 'operator':
        return `/operator-registration/${code}`;
      case 'assistant':
        return `/assistant-registration/${code}`;
      case 'instructor':
        return `/instructor-registration/${code}`;
      default:
        return '/register';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="text-center p-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Verifica del codice in corso...</h2>
          <p className="mt-2 text-muted-foreground">Stiamo controllando la validità del codice.</p>
        </div>
      </div>
    );
  }

  if (!isValid || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
        <Card className="max-w-md w-full shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Codice non valido</CardTitle>
            <CardDescription>
              Il codice di registrazione inserito non è valido o è scaduto.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Controlla il codice e riprova o contatta l'amministratore della palestra.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" asChild>
              <Link to="/register">
                Torna alla registrazione
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna alla home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto rounded-full bg-primary/10 p-3 w-fit mb-4">
            {getRoleIcon(role)}
          </div>
          <CardTitle className="text-xl">Registrazione {getRoleNameInItalian(role)}</CardTitle>
          <CardDescription>
            {gymName ? (
              <>Stai per unirti a <span className="font-medium">{gymName}</span> come {getRoleNameInItalian(role).toLowerCase()}</>
            ) : (
              <>Ti stai registrando come {getRoleNameInItalian(role).toLowerCase()}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Clicca sul pulsante qui sotto per procedere con la registrazione specifica per il tuo ruolo.
          </p>
          <Button className="w-full" asChild>
            <Link to={getRegistrationPath(role)}>
              Continua con la registrazione
            </Link>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link to="/register">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla registrazione
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JoinWithCode;
