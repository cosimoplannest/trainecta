
import React from 'react';
import { Link } from "react-router-dom";
import { RegisterHeader } from "@/components/auth/RegisterHeader";
import { RegistrationSteps } from "@/components/auth/RegistrationSteps";
import { PersonalInfoForm } from "@/components/auth/PersonalInfoForm";
import { GymInfoForm } from "@/components/auth/GymInfoForm";
import { useGymRegistration } from "@/hooks/useGymRegistration";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const GymRegistration = () => {
  const {
    formData,
    isLoading,
    step,
    registrationComplete,
    handleChange,
    handleSelectChange,
    nextStep,
    prevStep,
    handleSubmit
  } = useGymRegistration();

  if (registrationComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <CheckCircle className="h-12 w-12 text-primary mb-2" />
            <h2 className="text-2xl font-semibold">Registrazione completata!</h2>
            <p className="mt-2 text-muted-foreground mb-4">
              Ti stiamo reindirizzando alla dashboard...
            </p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-8">
        <RegisterHeader />
        
        <div className="bg-card shadow-md rounded-lg p-6 space-y-6">
          <RegistrationSteps currentStep={step} />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <PersonalInfoForm
                formData={formData}
                handleChange={handleChange}
                nextStep={nextStep}
              />
            )}
            
            {step === 2 && (
              <GymInfoForm
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
          </form>
          
          <div className="text-center space-y-4">
            <p className="text-sm">
              Hai già un account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Accedi
              </Link>
            </p>
            
            <Button variant="outline" size="sm" asChild>
              <Link to="/register">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna alle opzioni di registrazione
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymRegistration;
