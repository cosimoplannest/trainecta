
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { formatTemplateForWhatsApp, openWhatsApp } from "@/utils/whatsapp-utils";
import { WorkoutTemplate } from "@/types/workout";
import { Client } from "./types";
import { toast } from "sonner";
import { useState } from "react";

interface WhatsAppShareButtonProps {
  template: WorkoutTemplate;
  client: Client & { phone?: string };
  onSuccess?: () => void;
}

export function WhatsAppShareButton({ template, client, onSuccess }: WhatsAppShareButtonProps) {
  const [sending, setSending] = useState(false);

  const handleSendToWhatsApp = () => {
    if (!client.phone) {
      toast.error("Il cliente non ha un numero di telefono registrato");
      return;
    }

    try {
      setSending(true);
      
      // Format the template as WhatsApp message
      const message = formatTemplateForWhatsApp(template);
      
      // Open WhatsApp with the message
      openWhatsApp(client.phone, message);
      
      // Call the success callback
      if (onSuccess) {
        onSuccess();
      }
      
      toast.success("WhatsApp aperto con la scheda pronta per l'invio");
    } catch (error) {
      console.error("Error sending template to WhatsApp:", error);
      toast.error("Errore durante la preparazione del messaggio WhatsApp");
    } finally {
      setSending(false);
    }
  };
  
  return (
    <Button 
      onClick={handleSendToWhatsApp} 
      disabled={!client.phone || sending}
      variant="default"
      className="bg-green-600 hover:bg-green-700"
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      {sending ? "Preparazione..." : "Invia su WhatsApp"}
    </Button>
  );
}
