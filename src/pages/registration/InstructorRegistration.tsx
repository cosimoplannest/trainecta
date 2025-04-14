
import { useParams, Link } from "react-router-dom";
import { RegisterHeader } from "@/components/auth/RegisterHeader";
import { InstructorForm } from "@/components/auth/InstructorForm";
import { useInstructorRegistration } from "@/hooks/useInstructorRegistration";

const InstructorRegistration = () => {
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
    loadingSpecialties,
    specialties,
    selectedSpecialties,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPassword,
    setConfirmPassword,
    handleSpecialtyChange,
    handleSubmit
  } = useInstructorRegistration({ gymCode });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Registrazione Istruttore</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea il tuo account come istruttore per la palestra
          </p>
        </div>
        
        <div className="bg-card shadow-md rounded-lg p-6 space-y-6">
          <InstructorForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            password={password}
            confirmPassword={confirmPassword}
            validationError={validationError}
            isLoading={isLoading}
            loadingSpecialties={loadingSpecialties}
            specialties={specialties}
            selectedSpecialties={selectedSpecialties}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setEmail={setEmail}
            setPhone={setPhone}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            handleSpecialtyChange={handleSpecialtyChange}
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

export default InstructorRegistration;
