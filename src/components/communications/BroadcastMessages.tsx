import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle, Megaphone, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { it } from "date-fns/locale";
import { Database } from "@/integrations/supabase/types";

type FormValues = {
  title: string;
  content: string;
  targetRoles: string[];
  expiryDate?: Date;
};

type AppRole = Database["public"]["Enums"]["app_role"];

const roleOptions = [
  { id: "trainer" as AppRole, label: "Trainers" },
  { id: "assistant" as AppRole, label: "Assistenti di sala" },
  { id: "instructor" as AppRole, label: "Istruttori" },
  { id: "operator" as AppRole, label: "Operatori" },
  { id: "admin" as AppRole, label: "Amministratori" },
];

export function BroadcastMessages() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
      targetRoles: [],
    },
  });

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("broadcast_messages")
        .select(`
          id,
          title,
          content,
          sent_at,
          target_role,
          priority,
          sent_by,
          sent_by_user:sent_by(full_name)
        `)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Impossibile caricare i messaggi broadcast",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleToggle = (role: AppRole) => {
    setSelectedRoles((prev) => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      if (selectedRoles.length > 0) {
        const promises = selectedRoles.map(role => {
          return supabase.from("broadcast_messages").insert({
            title: data.title,
            content: data.content,
            sent_by: user.id,
            target_role: role,
            gym_id: "00000000-0000-0000-0000-000000000000", // Replace with actual gym ID from context
          });
        });
        
        const results = await Promise.all(promises);
        const hasError = results.some(result => result.error);
        
        if (hasError) {
          const errorMessages = results
            .filter(result => result.error)
            .map(result => result.error?.message)
            .join(", ");
          throw new Error(errorMessages);
        }
      } else {
        const { error } = await supabase.from("broadcast_messages").insert({
          title: data.title,
          content: data.content,
          sent_by: user.id,
          target_role: null,
          gym_id: "00000000-0000-0000-0000-000000000000", // Replace with actual gym ID from context
        });

        if (error) throw error;
      }

      toast({
        title: "Messaggio inviato",
        description: "Il messaggio broadcast è stato inviato con successo.",
      });
      form.reset();
      setSelectedRoles([]);
      setIsSheetOpen(false);
      fetchMessages();
    } catch (error: any) {
      console.error("Error submitting broadcast message:", error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore nell'invio del messaggio",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Messaggi Broadcast</h2>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Nuovo Messaggio</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Nuovo Messaggio Broadcast</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Il titolo è obbligatorio" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titolo</FormLabel>
                        <FormControl>
                          <Input placeholder="Titolo del messaggio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    rules={{ required: "Il contenuto è obbligatorio" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenuto</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Scrivi il messaggio..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetRoles"
                    render={() => (
                      <FormItem>
                        <FormLabel>Destinatari</FormLabel>
                        <div className="mt-2 space-y-2">
                          {roleOptions.map((role) => (
                            <div key={role.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`role-${role.id}`}
                                checked={selectedRoles.includes(role.id)}
                                onCheckedChange={() => {
                                  handleRoleToggle(role.id);
                                }}
                              />
                              <label
                                htmlFor={`role-${role.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {role.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data di scadenza (opzionale)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PP", { locale: it })
                                ) : (
                                  <span>Seleziona data</span>
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
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Invio in corso...
                      </>
                    ) : (
                      "Invia messaggio"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : messages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{message.title}</CardTitle>
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>
                  Da: {message.sent_by_user?.full_name || "Utente sconosciuto"} • 
                  {format(new Date(message.sent_at), " d MMMM yyyy", { locale: it })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm">{message.content}</p>
                {message.target_role && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Inviato a: {message.target_role}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 flex flex-col items-center justify-center rounded-lg p-8 text-center">
          <Megaphone className="mb-2 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">Nessun messaggio broadcast</h3>
          <p className="text-sm text-muted-foreground">
            Non ci sono messaggi broadcast al momento. Crea un nuovo messaggio per comunicare con il team.
          </p>
        </div>
      )}
    </div>
  );
}
