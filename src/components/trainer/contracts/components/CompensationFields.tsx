
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";

interface CompensationFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const CompensationFields = ({ form, disabled = false }: CompensationFieldsProps) => {
  const contractType = useWatch({
    control: form.control,
    name: "contract_type",
  });

  const showMonthlyFee = contractType !== 'vat_percentage';
  const showPercentage = contractType === 'vat_percentage';

  return (
    <div className="grid grid-cols-2 gap-4">
      {showMonthlyFee && (
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
                  disabled={disabled}
                  placeholder="Es. 1000.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : null;
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {showPercentage && (
        <FormField
          control={form.control}
          name="percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percentuale (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  disabled={disabled}
                  placeholder="Es. 20.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : null;
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
