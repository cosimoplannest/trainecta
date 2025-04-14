
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  description?: string;
  video_url?: string;
}

interface TemplateExercise {
  id: string;
  exercise_id: string;
  exercise?: Exercise;
  sets: number;
  reps: string;
  order_index: number;
  notes?: string;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  created_at: string;
  created_by?: string;
  user?: { full_name: string };
  locked: boolean;
  type?: string;
  gym_id: string;
  template_exercises?: TemplateExercise[];
  assignment_count?: number;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

interface AssignTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: WorkoutTemplate | null;
  onAssigned: () => void;
}

export function AssignTemplateDialog({ 
  open, 
  onOpenChange, 
  template, 
  onAssigned 
}: AssignTemplateDialogProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [deliveryChannel, setDeliveryChannel] = useState("whatsapp");
  const [notes, setNotes] = useState("");

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      if (!open) return;
      
      setClientsLoading(true);
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("id, first_name, last_name")
          .order("last_name");
          
        if (error) throw error;
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Errore durante il caricamento dei clienti");
      } finally {
        setClientsLoading(false);
      }
    };
    
    fetchClients();
  }, [open]);

  const handleAssignTemplate = async () => {
    if (!template) return;
    if (!selectedClient) {
      toast.error("Seleziona un cliente");
      return;
    }
    
    setLoading(true);
    try {
      // Insert into assigned_templates
      const { error } = await supabase
        .from("assigned_templates")
        .insert({
          template_id: template.id,
          client_id: selectedClient,
          assigned_by: "11111111-1111-1111-1111-111111111111", // Hardcoded for now
          delivery_channel: deliveryChannel,
          delivery_status: "sent",
          conversion_status: "pending",
          notes
        });
        
      if (error) throw error;
      
      // Log activity
      const selectedClientData = clients.find(c => c.id === selectedClient);
      await supabase.from("activity_logs").insert({
        action: "template_assigned",
        target_id: template.id,
        target_type: "workout_template",
        user_id: "11111111-1111-1111-1111-111111111111", // Hardcoded for now
        gym_id: template.gym_id,
        notes: `Template '${template.name}' assegnato al cliente ${selectedClientData?.first_name} ${selectedClientData?.last_name}`,
      });
      
      toast.success("Template assegnato con successo");
      onAssigned();
      onOpenChange(false);
      
      // Reset form
      setSelectedClient("");
      setDeliveryChannel("whatsapp");
      setNotes("");
    } catch (error) {
      console.error("Error assigning template:", error);
      toast.error("Errore durante l'assegnazione del template");
    } finally {
      setLoading(false);
    }
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assegna Template</DialogTitle>
          <DialogDescription>
            Assegna "{template.name}" a un cliente
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="client">Cliente</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder={clientsLoading ? "Caricamento clienti..." : "Seleziona cliente"} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.last_name} {client.first_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Metodo di invio</Label>
            <RadioGroup value={deliveryChannel} onValueChange={setDeliveryChannel} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="cursor-pointer">Email</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Note</Label>
            <Textarea 
              id="notes" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Note aggiuntive per questa assegnazione..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
          <Button onClick={handleAssignTemplate} disabled={loading || !selectedClient}>
            {loading ? "Assegnazione..." : "Assegna"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
