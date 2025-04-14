
import { UseFormReturn } from "react-hook-form";
import { User, CalendarIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePickerField from "./DatePickerField";
import { ClientFormData } from "../schemas/clientFormSchema";

interface PersonalInfoSectionProps {
  form: UseFormReturn<ClientFormData>;
}

const PersonalInfoSection = ({ form }: PersonalInfoSectionProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-medium flex items-center mb-4">
        <User className="mr-2 h-5 w-5" /> Dati Anagrafici & Contatti
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Mario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cognome *</FormLabel>
              <FormControl>
                <Input placeholder="Rossi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <DatePickerField
          form={form}
          name="birth_date"
          label="Data di nascita"
          required
          minDate={new Date("1900-01-01")}
          maxDate={new Date()}
        />
        
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sesso *</FormLabel>
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
                  <SelectItem value="male">Uomo</SelectItem>
                  <SelectItem value="female">Donna</SelectItem>
                  <SelectItem value="other">Altro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fiscal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codice Fiscale</FormLabel>
              <FormControl>
                <Input placeholder="RSSMRO80A01H501V" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefono *</FormLabel>
              <FormControl>
                <Input placeholder="+39 123 456 7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="mario.rossi@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indirizzo di residenza</FormLabel>
              <FormControl>
                <Input placeholder="Via Roma 123, 00100 Roma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
