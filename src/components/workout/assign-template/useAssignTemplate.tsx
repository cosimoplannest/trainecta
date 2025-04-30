
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
  const [selectedClientData, setSelectedClientData] = useState<Client & { phone?: string } | null>(null);
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

  // Effect to fetch selected client details when selectedClient changes
  useEffect(() => {
    const fetchSelectedClientData = async () => {
      if (!selectedClient) {
        setSelectedClientData(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("clients")
          .select("id, first_name, last_name, phone")
          .eq("id", selectedClient)
          .single();

        if (error) throw error;
        setSelectedClientData(data);
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast.error("Errore durante il recupero dei dettagli del cliente");
      }
    };

    fetchSelectedClientData();
  }, [selectedClient]);

  const fetchClients = async (isOpen: boolean) => {
    if (!isOpen) return;
    
    setClientsLoading(true);
    try {
      let query = supabase
        .from("clients")
        .select("id, first_name, last_name, phone");
        
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
          assigned_by: user?.id || "11111111-1111-1111-1111-111111111111",
          delivery_channel: deliveryChannel,
          delivery_status: "sent",
          conversion_status: "pending",
          notes
        });
        
      if (error) throw error;
      
      await supabase.from("activity_logs").insert({
        action: "template_assigned",
        target_id: template.id,
        target_type: "workout_template",
        user_id: user?.id || "11111111-1111-1111-1111-111111111111",
        gym_id: template.gym_id,
        notes: `Template '${template.name}' assegnato al cliente ${selectedClientData?.first_name} ${selectedClientData?.last_name}`,
      });
      
      toast.success("Template assegnato con successo");
      onAssigned();
      
      // Don't close the dialog yet if using WhatsApp delivery
      if (deliveryChannel !== "whatsapp") {
        onOpenChange(false);
      }
      
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
    selectedClientData,
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
