
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  sendNotification,
  sendNotificationToRole 
} from "@/services/notification-service";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendCheck, Users, User, Bell, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Define form schema for validations
const singleUserSchema = z.object({
  userId: z.string({
    required_error: "L'ID utente è obbligatorio",
  }),
  title: z.string()
    .min(3, { message: "Il titolo deve contenere almeno 3 caratteri" })
    .max(100, { message: "Il titolo non può superare i 100 caratteri" }),
  message: z.string()
    .min(5, { message: "Il messaggio deve contenere almeno 5 caratteri" })
    .max(500, { message: "Il messaggio non può superare i 500 caratteri" }),
  type: z.enum(['app', 'email', 'both'], {
    required_error: "Seleziona un tipo di notifica",
  }),
});

const roleSchema = z.object({
  role: z.string({
    required_error: "Il ruolo è obbligatorio",
  }),
  title: z.string()
    .min(3, { message: "Il titolo deve contenere almeno 3 caratteri" })
    .max(100, { message: "Il titolo non può superare i 100 caratteri" }),
  message: z.string()
    .min(5, { message: "Il messaggio deve contenere almeno 5 caratteri" })
    .max(500, { message: "Il messaggio non può superare i 500 caratteri" }),
  type: z.enum(['app', 'email', 'both'], {
    required_error: "Seleziona un tipo di notifica",
  }),
});

export function SendNotificationForm() {
  const [mode, setMode] = useState<'user' | 'role'>('user');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const userForm = useForm<z.infer<typeof singleUserSchema>>({
    resolver: zodResolver(singleUserSchema),
    defaultValues: {
      userId: "",
      title: "",
      message: "",
      type: "app",
    },
  });

  const roleForm = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: "",
      title: "",
      message: "",
      type: "app",
    },
  });

  const onSubmitUser = async (values: z.infer<typeof singleUserSchema>) => {
    setLoading(true);
    try {
      await sendNotification({
        userId: values.userId,
        title: values.title,
        message: values.message,
        type: values.type
      });
      
      toast({
        title: "Notifica inviata",
        description: "La notifica è stata inviata con successo"
      });
      
      userForm.reset();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Errore",
        description: "Impossibile inviare la notifica",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitRole = async (values: z.infer<typeof roleSchema>) => {
    setLoading(true);
    try {
      await sendNotificationToRole({
        role: values.role,
        title: values.title,
        message: values.message,
        type: values.type
      });
      
      toast({
        title: "Notifica inviata",
        description: "La notifica è stata inviata con successo al ruolo selezionato"
      });
      
      roleForm.reset();
    } catch (error) {
      console.error("Error sending role notification:", error);
      toast({
        title: "Errore",
        description: "Impossibile inviare la notifica",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Tabs value={mode} onValueChange={(value) => setMode(value as 'user' | 'role')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Utente singolo
          </TabsTrigger>
          <TabsTrigger value="role" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gruppo per ruolo
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="user">
          <Card>
            <CardContent className="pt-6">
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-6">
                  <FormField
                    control={userForm.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Utente</FormLabel>
                        <FormControl>
                          <Input placeholder="Inserisci l'ID utente" {...field} />
                        </FormControl>
                        <FormDescription>
                          Inserisci l'identificativo UUID dell'utente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={userForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titolo</FormLabel>
                        <FormControl>
                          <Input placeholder="Titolo della notifica" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={userForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Messaggio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Contenuto della notifica..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={userForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo di notifica</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            <FormItem>
                              <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="app" className="sr-only" />
                                </FormControl>
                                <Bell className="mb-3 h-6 w-6" />
                                App
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem>
                              <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="email" className="sr-only" />
                                </FormControl>
                                <Mail className="mb-3 h-6 w-6" />
                                Email
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem>
                              <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="both" className="sr-only" />
                                </FormControl>
                                <SendCheck className="mb-3 h-6 w-6" />
                                Entrambi
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <SendCheck className="mr-2 h-4 w-4" />
                        Invia notifica
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="role">
          <Card>
            <CardContent className="pt-6">
              <Form {...roleForm}>
                <form onSubmit={roleForm.handleSubmit(onSubmitRole)} className="space-y-6">
                  <FormField
                    control={roleForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ruolo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona un ruolo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Amministratori</SelectItem>
                            <SelectItem value="trainer">Trainer</SelectItem>
                            <SelectItem value="operator">Operatori</SelectItem>
                            <SelectItem value="instructor">Istruttori</SelectItem>
                            <SelectItem value="assistant">Assistenti</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          La notifica verrà inviata a tutti gli utenti con questo ruolo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={roleForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titolo</FormLabel>
                        <FormControl>
                          <Input placeholder="Titolo della notifica" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={roleForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Messaggio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Contenuto della notifica..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={roleForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo di notifica</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            <FormItem>
                              <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="app" className="sr-only" />
                                </FormControl>
                                <Bell className="mb-3 h-6 w-6" />
                                App
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem>
                              <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="email" className="sr-only" />
                                </FormControl>
                                <Mail className="mb-3 h-6 w-6" />
                                Email
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem>
                              <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value="both" className="sr-only" />
                                </FormControl>
                                <SendCheck className="mb-3 h-6 w-6" />
                                Entrambi
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <SendCheck className="mr-2 h-4 w-4" />
                        Invia notifica per ruolo
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
