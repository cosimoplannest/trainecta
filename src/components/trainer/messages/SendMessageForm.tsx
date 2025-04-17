
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type FormValues = {
  title: string;
  content: string;
  priority: "normal" | "high" | "low";
  targetRole: "all" | "trainers" | "clients";
};

export function SendMessageForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
      priority: "normal",
      targetRole: "clients",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user?.id) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per inviare messaggi",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("broadcast_messages").insert({
        title: data.title,
        content: data.content,
        priority: data.priority,
        target_role: data.targetRole,
        sent_by: user.id,
        gym_id: user.user_metadata?.gym_id || "11111111-1111-1111-1111-111111111111", // Fallback to default gym
      });

      if (error) throw error;

      toast({
        title: "Messaggio inviato",
        description: "Il tuo messaggio è stato inviato con successo",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'invio del messaggio",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
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
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorità</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona priorità" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Bassa</SelectItem>
                      <SelectItem value="normal">Normale</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatari</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona destinatari" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clients">I miei clienti</SelectItem>
                      <SelectItem value="trainers">Trainer</SelectItem>
                      <SelectItem value="all">Tutti</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Messaggio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Scrivi il tuo messaggio qui..." 
                  className="min-h-32 resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Invio in corso..." : "Invia Messaggio"}
        </Button>
      </form>
    </Form>
  );
}
