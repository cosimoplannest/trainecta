
import { UseFormReturn } from "react-hook-form";
import { CreditCard } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePickerField from "./DatePickerField";
import { ClientFormData } from "../schemas/clientFormSchema";

interface SubscriptionSectionProps {
  form: UseFormReturn<ClientFormData>;
  subscriptions: { id: string; name: string }[];
}

const SubscriptionSection = ({ form, subscriptions }: SubscriptionSectionProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-medium flex items-center mb-4">
        <CreditCard className="mr-2 h-5 w-5" /> Abbonamento
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="subscription_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo di abbonamento</FormLabel>
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
                  {subscriptions.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
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
          name="subscription_duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durata abbonamento</FormLabel>
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
                  <SelectItem value="monthly">Mensile</SelectItem>
                  <SelectItem value="quarterly">Trimestrale</SelectItem>
                  <SelectItem value="semiannual">Semestrale</SelectItem>
                  <SelectItem value="annual">Annuale</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <DatePickerField
          form={form}
          name="subscription_start_date"
          label="Data inizio abbonamento"
        />
        <DatePickerField
          form={form}
          name="subscription_end_date"
          label="Data scadenza abbonamento"
        />
      </div>
    </div>
  );
};

export default SubscriptionSection;
