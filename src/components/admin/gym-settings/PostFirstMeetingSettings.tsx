
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GymSettingsFormValues } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, XCircle, CheckCircle, ClipboardList } from "lucide-react";

interface PostFirstMeetingSettingsProps {
  form: UseFormReturn<GymSettingsFormValues>;
}

export function PostFirstMeetingSettings({ form }: PostFirstMeetingSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flussi Post-Primo Incontro</CardTitle>
        <CardDescription>
          Configura i flussi automatizzati in base all'esito del primo incontro tra trainer e cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* No Sale Block */}
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-destructive" />
            <h3 className="font-medium">Non ha venduto nulla</h3>
          </div>
          
          <FormField
            control={form.control}
            name="days_to_first_followup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giorni tra primo incontro e follow-up</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Imposta il numero di giorni dopo cui pianificare automaticamente il follow-up
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        {/* Package Sale Block */}
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Venduto pacchetto di lezioni</h3>
          </div>
          
          <FormField
            control={form.control}
            name="package_confirmation_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giorni per conferma attività</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Dopo quanti giorni chiedere al trainer se il cliente è ancora attivo
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        {/* Custom Plan Sale Block */}
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Venduta scheda personalizzata</h3>
          </div>
          
          <FormField
            control={form.control}
            name="custom_plan_confirmation_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giorni per conferma attività</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Dopo quanti giorni chiedere al trainer se il cliente è ancora attivo
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        {/* Notification Preferences */}
        <div className="rounded-lg border p-4 space-y-4">
          <h3 className="font-medium">Canali di notifica</h3>
          <FormField
            control={form.control}
            name="notification_channels"
            render={() => (
              <FormItem>
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
                    <FormLabel className="font-normal">
                      Notifiche in-app
                    </FormLabel>
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
                    <FormLabel className="font-normal">
                      Email
                    </FormLabel>
                  </FormItem>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
