
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { GymSettingsFormValues } from "./types";
import { Badge } from "@/components/ui/badge";

interface OperationalSettingsProps {
  form: UseFormReturn<GymSettingsFormValues>;
}

export function OperationalSettings({ form }: OperationalSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impostazioni Operative</CardTitle>
        <CardDescription>
          Configura i parametri operativi della tua palestra e i flussi post-primo incontro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Impostazioni Generali</h3>
            
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

            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Flussi Post-Primo Incontro</h3>
              
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center">
                  <Badge variant="destructive" className="mr-2">Non ha venduto</Badge>
                  <p className="font-medium">Gestione cliente senza vendita</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="require_default_template_assignment"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel>Assegnazione obbligatoria di scheda precompilata</FormLabel>
                        <FormDescription>
                          Il trainer deve assegnare una scheda precompilata al cliente se non ha venduto nulla
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="days_to_first_followup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giorni per Follow-up Obbligatorio</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Numero di giorni dopo il primo incontro senza vendita prima del follow-up obbligatorio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center">
                  <Badge variant="success" className="mr-2">Pacchetto lezioni</Badge>
                  <p className="font-medium">Gestione cliente con pacchetto</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="package_confirmation_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giorni per Conferma Attività (Pacchetto)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Giorni dopo i quali chiedere al trainer di confermare che il cliente è ancora attivo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center">
                  <Badge variant="success" className="mr-2">Scheda personalizzata</Badge>
                  <p className="font-medium">Gestione cliente con scheda</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="custom_plan_confirmation_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giorni per Conferma Attività (Scheda)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Giorni dopo i quali chiedere al trainer di confermare che il cliente è ancora attivo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Notifiche</Badge>
                  <p className="font-medium">Preferenze di notifica</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="notification_channels"
                  render={() => (
                    <FormItem>
                      <FormLabel>Canali di notifica per richieste e follow-up</FormLabel>
                      <div className="space-y-2">
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={form.watch("notification_channels").includes("app")}
                              onCheckedChange={(checked) => {
                                const current = [...form.watch("notification_channels")];
                                if (checked) {
                                  if (!current.includes("app")) {
                                    form.setValue("notification_channels", [...current, "app"]);
                                  }
                                } else {
                                  form.setValue("notification_channels", current.filter(v => v !== "app"));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Notifiche in-app</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={form.watch("notification_channels").includes("email")}
                              onCheckedChange={(checked) => {
                                const current = [...form.watch("notification_channels")];
                                if (checked) {
                                  if (!current.includes("email")) {
                                    form.setValue("notification_channels", [...current, "email"]);
                                  }
                                } else {
                                  form.setValue("notification_channels", current.filter(v => v !== "email"));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Email</FormLabel>
                        </FormItem>
                      </div>
                      <FormDescription>
                        Seleziona i canali per l'invio di notifiche relative a follow-up e conferme clienti
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium">Metodi di Vendita</h3>
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
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
