
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccessLogs } from "../hooks/useAccessLogs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Loader2, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const accessLogSchema = z.object({
  date: z.date({
    required_error: "La data è obbligatoria",
  }),
  csvData: z.string().min(1, "I dati sono obbligatori"),
});

type FormData = z.infer<typeof accessLogSchema>;

export function AccessLogImport() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { importAccessLogs } = useAccessLogs();
  
  const form = useForm<FormData>({
    resolver: zodResolver(accessLogSchema),
    defaultValues: {
      date: new Date(),
      csvData: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const dateString = format(data.date, "yyyy-MM-dd");
      await importAccessLogs(dateString, data.csvData);
      form.reset({
        date: data.date,
        csvData: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importa accessi</CardTitle>
        <CardDescription>
          Importa i dati di accesso dalla tua palestra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "EEEE d MMMM yyyy", { locale: it })
                          ) : (
                            <span>Seleziona una data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={it}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="csvData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dati CSV</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="10:00,45&#10;10:30,60&#10;11:00,75&#10;..."
                      {...field}
                      rows={10}
                    />
                  </FormControl>
                  <FormDescription>
                    Inserisci i dati nel formato orario,numero_accessi per ogni riga (es. 10:00,45)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Importazione..." : "Importa dati"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
