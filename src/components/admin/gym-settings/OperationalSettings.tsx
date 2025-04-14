
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { GymSettingsFormValues } from "./types";

interface OperationalSettingsProps {
  form: UseFormReturn<GymSettingsFormValues>;
}

export function OperationalSettings({ form }: OperationalSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impostazioni Operative</CardTitle>
        <CardDescription>
          Configura i parametri operativi della tua palestra
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="enable_auto_followup"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Follow-up Automatico</FormLabel>
                  <FormDescription>
                    Attiva il follow-up automatico dei clienti
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

          {form.watch("enable_auto_followup") && (
            <FormField
              control={form.control}
              name="days_to_first_followup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giorni per il Primo Follow-up</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Numero di giorni prima del primo follow-up dopo una prova
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="days_to_active_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giorni per Conferma Cliente Attivo</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Giorni dopo i quali un cliente viene considerato attivo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sale_methods"
            render={() => (
              <FormItem>
                <FormLabel>Metodo di Vendita Personal Trainer</FormLabel>
                <div className="space-y-2">
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={form.watch("sale_methods").includes("package")}
                        onCheckedChange={(checked) => {
                          const current = [...form.watch("sale_methods")];
                          if (checked) {
                            if (!current.includes("package")) {
                              form.setValue("sale_methods", [...current, "package"]);
                            }
                          } else {
                            form.setValue("sale_methods", current.filter(v => v !== "package"));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Pacchetti personal</FormLabel>
                  </FormItem>
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={form.watch("sale_methods").includes("custom")}
                        onCheckedChange={(checked) => {
                          const current = [...form.watch("sale_methods")];
                          if (checked) {
                            if (!current.includes("custom")) {
                              form.setValue("sale_methods", [...current, "custom"]);
                            }
                          } else {
                            form.setValue("sale_methods", current.filter(v => v !== "custom"));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Schede personalizzate</FormLabel>
                  </FormItem>
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={form.watch("sale_methods").includes("both")}
                        onCheckedChange={(checked) => {
                          const current = [...form.watch("sale_methods")];
                          if (checked) {
                            if (!current.includes("both")) {
                              form.setValue("sale_methods", [...current, "both"]);
                            }
                          } else {
                            form.setValue("sale_methods", current.filter(v => v !== "both"));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Entrambi</FormLabel>
                  </FormItem>
                </div>
                <FormDescription>
                  Seleziona i metodi di vendita PT supportati dalla palestra
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
