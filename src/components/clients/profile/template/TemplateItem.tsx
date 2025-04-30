
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplateStatusBadges from "./TemplateStatusBadges";
import TemplateExerciseDetails from "./TemplateExerciseDetails";
import { formatTemplateForWhatsApp, openWhatsApp } from "@/utils/whatsapp-utils";
import { toast } from "sonner";

interface TemplateExercise {
  id: string;
  sets: number;
  reps: string;
  order_index: number;
  exercise: {
    id: string;
    name: string;
    video_url?: string;
  }
  notes?: string;
}

interface AssignedTemplate {
  id: string;
  assigned_at: string;
  workout_template: { 
    id: string;
    name: string; 
    type: string; 
    category: string;
    description?: string;
    template_exercises?: TemplateExercise[];
  } | null;
  assigned_by_user: { full_name: string } | null;
  delivery_status: string;
  delivery_channel: string;
  conversion_status: string | null;
}

interface TemplateItemProps {
  template: AssignedTemplate;
  isActive: boolean;
  onToggle: () => void;
  clientPhone?: string;
}

const TemplateItem = ({ template, isActive, onToggle, clientPhone }: TemplateItemProps) => {
  const [sending, setSending] = useState(false);
  
  const handleSendToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the template details
    
    if (!clientPhone) {
      toast.error("Il cliente non ha un numero di telefono registrato");
      return;
    }
    
    if (!template.workout_template) {
      toast.error("Dettagli del template non disponibili");
      return;
    }

    try {
      setSending(true);
      
      // Format the template as WhatsApp message
      const message = formatTemplateForWhatsApp(template.workout_template);
      
      // Open WhatsApp with the message
      openWhatsApp(clientPhone, message);
      
      toast.success("WhatsApp aperto con la scheda pronta per l'invio");
    } catch (error) {
      console.error("Error sending template to WhatsApp:", error);
      toast.error("Errore durante la preparazione del messaggio WhatsApp");
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div key={template.id}>
      <div 
        className="flex items-start gap-4 pb-4 border-b cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {template.workout_template?.name || "Scheda senza nome"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {template.workout_template?.type || "Tipo non specificato"}
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {template.workout_template?.category || "Categoria non specificata"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {template.delivery_channel === "whatsapp" && clientPhone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
                  onClick={handleSendToWhatsApp}
                  disabled={sending}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {sending ? "..." : "WhatsApp"}
                </Button>
              )}
              <p className="text-sm text-muted-foreground">
                {format(new Date(template.assigned_at), "d MMM yyyy", { locale: it })}
              </p>
            </div>
          </div>
          
          <TemplateStatusBadges 
            conversionStatus={template.conversion_status}
            deliveryStatus={template.delivery_status}
            deliveryChannel={template.delivery_channel}
          />
          
          {template.assigned_by_user && (
            <p className="text-sm text-muted-foreground mt-2">
              Assegnato da: {template.assigned_by_user.full_name}
            </p>
          )}
        </div>
      </div>
      
      {isActive && template.workout_template?.template_exercises && (
        <TemplateExerciseDetails exercises={template.workout_template.template_exercises} />
      )}
    </div>
  );
};

export default TemplateItem;
