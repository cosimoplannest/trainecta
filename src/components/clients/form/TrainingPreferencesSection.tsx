
import { UseFormReturn } from "react-hook-form";
import { Clock } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientFormData } from "../schemas/clientFormSchema";
import { workoutTimePreferences } from "../constants/clientFormData";

interface TrainingPreferencesSectionProps {
  form: UseFormReturn<ClientFormData>;
}

const TrainingPreferencesSection = ({ form }: TrainingPreferencesSectionProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-medium flex items-center mb-4">
        <Clock className="mr-2 h-5 w-5" /> Preferenze di Allenamento
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="preferred_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fascia oraria di allenamento preferita</FormLabel>
              <FormControl>
                <RadioGroup 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  {workoutTimePreferences.map((time) => (
                    <FormItem key={time.id} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={time.id} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {time.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default TrainingPreferencesSection;
