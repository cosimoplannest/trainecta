
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StepProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

const Step = ({ icon: Icon, label, isActive = false, isCompleted = false }: StepProps) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : isCompleted
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span
        className={cn(
          "text-xs font-medium text-center",
          isActive
            ? "text-primary"
            : isCompleted
            ? "text-primary/80"
            : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
};

interface StepsProps {
  steps: {
    icon: LucideIcon;
    label: string;
  }[];
  currentStep: number;
  className?: string;
}

export const Steps = ({ steps, currentStep, className }: StepsProps) => {
  return (
    <div className={cn("flex justify-between items-center w-full relative mb-6", className)}>
      {/* Line connecting steps */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0" />
      
      {/* Progress line */}
      <div
        className="absolute top-5 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all"
        style={{
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
        }}
      />
      
      {/* Steps */}
      {steps.map((step, index) => (
        <div key={index} className="z-10 px-2 bg-background">
          <Step
            icon={step.icon}
            label={step.label}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
          />
        </div>
      ))}
    </div>
  );
};
