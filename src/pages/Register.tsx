
import React from 'react';
import { Link } from "react-router-dom";
import { RegisterHeader } from "@/components/auth/RegisterHeader";
import { RegistrationSteps } from "@/components/auth/RegistrationSteps";
import { PersonalInfoForm } from "@/components/auth/PersonalInfoForm";
import { GymInfoForm } from "@/components/auth/GymInfoForm";
import { useGymRegistration } from "@/hooks/useGymRegistration";

const Register = () => {
  const {
    formData,
    isLoading,
    step,
    handleChange,
    handleSelectChange,
    nextStep,
    prevStep,
    handleSubmit
  } = useGymRegistration();

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

export default Register;
