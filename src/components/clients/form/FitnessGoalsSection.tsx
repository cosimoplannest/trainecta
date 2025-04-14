
import { UseFormReturn } from "react-hook-form";
import { Target } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientFormData } from "../schemas/clientFormSchema";
import { fitnessGoals, fitnessLevels } from "../constants/clientFormData";

interface FitnessGoalsSectionProps {
  form: UseFormReturn<ClientFormData>;
}

const FitnessGoalsSection = ({ form }: FitnessGoalsSectionProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-medium flex items-center mb-4">
        <Target className="mr-2 h-5 w-5" /> Obiettivi e Livello
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="primary_goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obiettivo primario</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fitnessGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fitness_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Livello attuale di forma fisica</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fitnessLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FitnessGoalsSection;
