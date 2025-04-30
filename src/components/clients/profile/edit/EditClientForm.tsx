
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientFormData } from "../types/edit-client-types";
import { UseFormReturn } from "react-hook-form";
import { fitnessGoals, workoutTimePreferences, fitnessLevels } from "../../constants/clientFormData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EditClientFormProps {
  form: UseFormReturn<ClientFormData>;
  isLoading: boolean;
}

const EditClientForm = ({ form, isLoading }: EditClientFormProps) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="personal">Dati Personali</TabsTrigger>
        <TabsTrigger value="preferences">Preferenze</TabsTrigger>
        <TabsTrigger value="notes">Note</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
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
                <FormLabel>Cognome</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sesso</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefono</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="preferences" className="space-y-4">
        <h3 className="text-sm font-medium mb-2">Preferenze di Contatto</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="contact_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quando preferisce essere contattato</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="morning">Mattina</SelectItem>
                    <SelectItem value="afternoon">Pomeriggio</SelectItem>
                    <SelectItem value="evening">Sera</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Come preferisce essere contattato</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="phone">Telefonata</SelectItem>
                    <SelectItem value="message">Messaggio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <h3 className="text-sm font-medium mt-4 mb-2">Preferenze di Allenamento</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="preferred_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orario preferito per allenarsi</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workoutTimePreferences.map((time) => (
                      <SelectItem key={time.id} value={time.id}>
                        {time.label}
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
            name="primary_goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Obiettivo primario</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fitnessGoals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.label}
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
            name="fitness_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Livello di fitness</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fitnessLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TabsContent>

      <TabsContent value="notes">
        <FormField
          control={form.control}
          name="internal_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Interne</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Inserisci note sul cliente..."
                  className="min-h-[150px]"
                  {...field}
                  value={field.value || ''}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EditClientForm;
