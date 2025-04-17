
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface CompensationFieldsProps {
  form: UseFormReturn<any>;
  disabled: boolean;
}

export function CompensationFields({ form, disabled }: CompensationFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="monthly_fee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Compenso Mensile (€)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                disabled={disabled}
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentuale (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="0.0"
                disabled={disabled}
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
