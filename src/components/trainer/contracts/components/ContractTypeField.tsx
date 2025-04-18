
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface ContractTypeFieldProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const ContractTypeField = ({ form, disabled = false }: ContractTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="contract_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo di Contratto</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value} 
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo di contratto" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="collaboration">Collaborazione</SelectItem>
              <SelectItem value="vat_fixed_fee">Partita IVA (Compenso Fisso)</SelectItem>
              <SelectItem value="vat_percentage">Partita IVA (Percentuale)</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
