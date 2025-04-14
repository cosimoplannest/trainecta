
import React from 'react';

interface RegistrationStepsProps {
  currentStep: number;
}

export const RegistrationSteps: React.FC<RegistrationStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between mb-4">
      {[1, 2].map((step) => (
        <div 
          key={step} 
          className={`w-1/2 h-1 rounded-full ${step <= currentStep ? "bg-primary" : "bg-muted"}`}
        />
      ))}
    </div>
  );
};
