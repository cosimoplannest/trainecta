
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GymSettingsFormValues } from "./types";

interface AdvancedSettingsProps {
  form: UseFormReturn<GymSettingsFormValues>;
}

export function AdvancedSettings({ form }: AdvancedSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impostazioni Avanzate</CardTitle>
        <CardDescription>
          Configura le impostazioni avanzate della piattaforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="template_sent_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invio Schede Workout</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona chi può inviare le schede" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="trainer">Solo Trainer</SelectItem>
                    <SelectItem value="system">Solo Sistema</SelectItem>
                    <SelectItem value="both">Entrambi</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Chi può inviare le schede di workout ai clienti
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="template_viewable_by_client"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Visibilità Schede ai Clienti</FormLabel>
                  <FormDescription>
                    I clienti possono visualizzare le schede assegnate
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allow_template_duplication"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Duplicazione Schede</FormLabel>
                  <FormDescription>
                    Abilita la duplicazione delle schede di workout
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="default_trainer_assignment_logic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logica Assegnazione Trainer</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="manual">Manuale</option>
                    <option value="round_robin">Round Robin</option>
                    <option value="workload">Bilanciamento Carico</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Come vengono assegnati i trainer ai nuovi clienti
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
