
import { useParams, Link } from "react-router-dom";
import { useAssistantRegistration } from "@/hooks/useAssistantRegistration";
import { ArrowLeft, Clock, Shield, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssistantForm } from "@/components/auth/AssistantForm";
import { Button } from "@/components/ui/button";
import { Steps } from "@/components/ui/steps";

const steps = [
  { icon: User, label: "Dati Personali" },
  { icon: Shield, label: "Verifica" },
  { icon: Clock, label: "Approvazione" }
];

const AssistantRegistration = () => {
  const { gymCode } = useParams<{ gymCode: string }>();
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    isLoading,
    validationError,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPassword,
    setConfirmPassword,
    handleSubmit
  } = useAssistantRegistration({ gymCode });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Registrazione Assistente</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea il tuo account come assistente di sala per la palestra
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
            <AssistantForm
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              password={password}
              confirmPassword={confirmPassword}
              validationError={validationError}
              isLoading={isLoading}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
              setPhone={setPhone}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              handleSubmit={handleSubmit}
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

export default AssistantRegistration;
