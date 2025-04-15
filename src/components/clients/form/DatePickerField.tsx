
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ClientFormData } from "../schemas/clientFormSchema";
import { DayPickerRangeProps, DateRange } from "react-day-picker";

interface DatePickerFieldProps {
  form: UseFormReturn<ClientFormData>;
  name: keyof ClientFormData;
  label: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const DatePickerField = ({
  form,
  name,
  label,
  required = false,
  minDate,
  maxDate,
}: DatePickerFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label} {required && "*"}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={`w-full pl-3 text-left font-normal ${
                    !field.value ? "text-muted-foreground" : ""
                  }`}
                >
                  {field.value ? (
                    format(field.value, "dd/MM/yyyy", { locale: it })
                  ) : (
                    <span>Seleziona data...</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => {
                  // Make sure we have a valid date to compare
                  if (!date) return false;
                  
                  // Check if the date is before the minimum date
                  if (minDate instanceof Date && date < minDate) {
                    return true;
                  }
                  
                  // Check if the date is after the maximum date
                  if (maxDate instanceof Date && date > maxDate) {
                    return true;
                  }
                  
                  // If no conditions are met, the date is not disabled
                  return false;
                }}
                initialFocus
                locale={it}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
