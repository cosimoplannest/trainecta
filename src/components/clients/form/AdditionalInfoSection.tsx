
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DatePickerField from "./DatePickerField";
import { ClientFormData } from "../schemas/clientFormSchema";
import { it } from "date-fns/locale";

interface AdditionalInfoSectionProps {
  form: UseFormReturn<ClientFormData>;
  trainers: { id: string; full_name: string }[];
}

const AdditionalInfoSection = ({ form, trainers }: AdditionalInfoSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origine</FormLabel>
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
                  <SelectItem value="walk-in">Visita diretta</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="social">Social media</SelectItem>
                  <SelectItem value="other">Altro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assegna a Trainer</FormLabel>
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
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="internal_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Note interne</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Inserisci qui eventuali note..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Note visibili solo a staff e trainer.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <DatePickerField
        form={form}
        name="joined_at"
        label="Data iscrizione"
        required
        minDate={new Date("1900-01-01")}
        maxDate={new Date()}
      />
    </>
  );
};

export default AdditionalInfoSection;
