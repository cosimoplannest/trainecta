
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditClientDialogProps, ClientFormData } from "./types/edit-client-types";
import EditClientForm from "./edit/EditClientForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const clientFormSchema = z.object({
  first_name: z.string().min(1, "Il nome è richiesto"),
  last_name: z.string().min(1, "Il cognome è richiesto"),
  email: z.string().email("Email non valida").nullable(),
  phone: z.string().nullable(),
  gender: z.string().nullable(),
  birth_date: z.date().optional(),
  internal_notes: z.string().nullable(),
});

const EditClientDialog = ({ client, open, onClose, onSuccess }: EditClientDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone,
      gender: client.gender,
      birth_date: client.birth_date ? new Date(client.birth_date) : undefined,
      internal_notes: client.internal_notes,
    }
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email || null,
          phone: data.phone || null,
          gender: data.gender || null,
          birth_date: data.birth_date ? data.birth_date.toISOString() : null,
          internal_notes: data.internal_notes || null,
        })
        .eq("id", client.id);
      
      if (error) throw error;
      
      toast({
        title: "Cliente aggiornato",
        description: "I dati del cliente sono stati aggiornati con successo.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Errore durante l'aggiornamento del cliente:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento dei dati.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifica Cliente</DialogTitle>
          <DialogDescription>
            Modifica i dati personali del cliente
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EditClientForm form={form} isLoading={isLoading} />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isLoading}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvataggio..." : "Salva modifiche"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
