
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Shield, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Steps } from "@/components/ui/steps";
import { GenericRegistrationForm } from "@/components/auth/GenericRegistrationForm";

const steps = [
  { icon: User, label: "Dati Personali" },
  { icon: Shield, label: "Verifica" },
  { icon: Clock, label: "Approvazione" }
];

interface GenericRegistrationProps {
  roleName: string;
  roleId: string;
  showPhoneField?: boolean;
  requiresSpecialties?: boolean;
  gymCode?: string;
}

const GenericRegistration = ({
  roleName,
  roleId,
  showPhoneField = false,
  requiresSpecialties = false,
  gymCode
}: GenericRegistrationProps) => {
  // If no gymCode is passed as prop, try to get it from URL params
  const params = useParams<{ gymCode?: string }>();
  const codeToUse = gymCode || params.gymCode;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Registrazione {roleName}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea il tuo account come {roleName.toLowerCase()} per la palestra
          </p>
        </div>
        
        <Card className="shadow-lg border-primary/10 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Inserisci i tuoi dati</CardTitle>
            <CardDescription>
              Compila tutti i campi per completare la registrazione
            </CardDescription>
          </CardHeader>
          
          <Steps currentStep={0} steps={steps} className="px-6" />
          
          <CardContent className="pt-4 space-y-4">
            <GenericRegistrationForm 
              roleName={roleName}
              roleId={roleId}
              showPhoneField={showPhoneField}
              requiresSpecialties={requiresSpecialties}
              gymCode={codeToUse}
            />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t bg-muted/10 pt-6">
            <div className="text-center text-sm">
              <p>
                Hai già un account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Accedi
                </Link>
              </p>
            </div>
            
            <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna alla home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default GenericRegistration;
