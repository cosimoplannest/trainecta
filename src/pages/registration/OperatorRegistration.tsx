
import { useParams, Link } from "react-router-dom";
import { RegisterHeader } from "@/components/auth/RegisterHeader";
import { OperatorForm } from "@/components/auth/OperatorForm";
import { useOperatorRegistration } from "@/hooks/useOperatorRegistration";

const OperatorRegistration = () => {
  const { gymCode } = useParams<{ gymCode: string }>();
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    isLoading,
    validationError,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit
  } = useOperatorRegistration({ gymCode });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Registrazione Operatore</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea il tuo account come operatore per la palestra
          </p>
        </div>
        
        <div className="bg-card shadow-md rounded-lg p-6 space-y-6">
          <OperatorForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            validationError={validationError}
            isLoading={isLoading}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setEmail={setEmail}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            handleSubmit={handleSubmit}
          />
          
          <div className="text-center text-sm">
            <p>
              Hai già un account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorRegistration;
