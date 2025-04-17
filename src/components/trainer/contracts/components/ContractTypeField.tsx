
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface ContractTypeFieldProps {
  form: UseFormReturn<any>;
  disabled: boolean;
}

export function ContractTypeField({ form, disabled }: ContractTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="contract_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo Contratto</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo contratto" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="collaboration">Collaborazione</SelectItem>
              <SelectItem value="vat_fixed_fee">Partita IVA (Compenso Fisso)</SelectItem>
              <SelectItem value="vat_percentage">Partita IVA (Percentuale)</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
