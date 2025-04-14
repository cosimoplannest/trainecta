
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { GymSettingsFormValues } from "./types";

interface GeneralSettingsProps {
  form: UseFormReturn<GymSettingsFormValues>;
}

export function GeneralSettings({ form }: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Impostazioni Generali
        </CardTitle>
        <CardDescription>
          Configura le impostazioni di base della tua palestra
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Palestra</FormLabel>
                <FormControl>
                  <Input placeholder="Nome della palestra" {...field} />
                </FormControl>
                <FormDescription>
                  Il nome della tua palestra che apparirà in tutta l'applicazione
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_trials_per_client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero Totale di Prove Gratuite</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Numero di prove gratuite disponibili per la tua palestra
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </CardContent>
    </Card>
  );
}
