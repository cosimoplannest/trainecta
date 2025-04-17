
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Client } from "./types";
import { WorkoutTemplate } from "@/types/workout";

export function useAssignTemplate(template: WorkoutTemplate | null, onAssigned: () => void, onOpenChange: (open: boolean) => void) {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [deliveryChannel, setDeliveryChannel] = useState("whatsapp");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, userRole } = useAuth();

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

  const fetchClients = async (isOpen: boolean) => {
    if (!isOpen) return;
    
    setClientsLoading(true);
    try {
      let query = supabase
        .from("clients")
        .select("id, first_name, last_name");
        
      // If user is a trainer, only fetch their assigned clients
      if (userRole === 'trainer' && user) {
        query = query.eq('assigned_to', user.id);
      }
      
      query = query.order("last_name");
        
      const { data, error } = await query;
        
      if (error) throw error;
      setClients(data || []);
      setFilteredClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Errore durante il caricamento dei clienti");
    } finally {
      setClientsLoading(false);
    }
  };

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
      
      // Reset form
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

  return {
    clients,
    filteredClients,
    loading,
    clientsLoading,
    selectedClient,
    setSelectedClient,
    deliveryChannel,
    setDeliveryChannel,
    notes,
    setNotes,
    searchQuery,
    setSearchQuery,
    fetchClients,
    handleAssignTemplate
  };
}
