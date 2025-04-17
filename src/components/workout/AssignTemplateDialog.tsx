
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
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WorkoutTemplate } from "@/types/workout";
import { Search } from "lucide-react";

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
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [deliveryChannel, setDeliveryChannel] = useState("whatsapp");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
        setFilteredClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Errore durante il caricamento dei clienti");
      } finally {
        setClientsLoading(false);
      }
    };
    
    fetchClients();
  }, [open]);

  useEffect(() => {
    // This effect should filter clients when searchQuery changes
    if (searchQuery.trim() === "") {
      setFilteredClients(clients);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = clients.filter(client => {
      const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
      return fullName.includes(lowerQuery);
    });
    
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const handleAssignTemplate = async () => {
    if (!template) return;
    if (!selectedClient) {
      toast.error("Seleziona un cliente");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("assigned_templates")
        .insert({
          template_id: template.id,
          client_id: selectedClient,
          assigned_by: "11111111-1111-1111-1111-111111111111",
          delivery_channel: deliveryChannel,
          delivery_status: "sent",
          conversion_status: "pending",
          notes
        });
        
      if (error) throw error;
      
      const selectedClientData = clients.find(c => c.id === selectedClient);
      await supabase.from("activity_logs").insert({
        action: "template_assigned",
        target_id: template.id,
        target_type: "workout_template",
        user_id: "11111111-1111-1111-1111-111111111111",
        gym_id: template.gym_id,
        notes: `Template '${template.name}' assegnato al cliente ${selectedClientData?.first_name} ${selectedClientData?.last_name}`,
      });
      
      toast.success("Template assegnato con successo");
      onAssigned();
      onOpenChange(false);
      
      setSelectedClient("");
      setDeliveryChannel("whatsapp");
      setNotes("");
      setSearchQuery("");
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
            <Label htmlFor="client-search">Cerca cliente</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="client-search"
                type="text"
                placeholder="Cerca per nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="client">Cliente</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder={clientsLoading ? "Caricamento clienti..." : "Seleziona cliente"} />
              </SelectTrigger>
              <SelectContent>
                {filteredClients.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Nessun cliente trovato
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.last_name} {client.first_name}
                    </SelectItem>
                  ))
                )}
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
