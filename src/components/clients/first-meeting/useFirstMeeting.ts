
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ClientData } from "../types/client-types";

export const useFirstMeeting = (client: ClientData) => {
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(
    client.first_meeting_date ? new Date(client.first_meeting_date) : undefined
  );
  const [meetingCompleted, setMeetingCompleted] = useState(client.first_meeting_completed || false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setMeetingDate(client.first_meeting_date ? new Date(client.first_meeting_date) : undefined);
    setMeetingCompleted(client.first_meeting_completed || false);
  }, [client]);

  const updateFirstMeetingDate = async () => {
    if (!meetingDate) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({ 
          first_meeting_date: meetingDate.toISOString(),
        })
        .eq("id", client.id);
      
      if (error) throw error;

      // Log activity
      await logActivity("first_meeting_date_updated", `Data primo incontro aggiornata a ${meetingDate.toLocaleDateString()}`);
      
      toast({
        title: "Data aggiornata",
        description: "La data del primo incontro è stata aggiornata con successo",
      });

      // Trigger refresh if callback exists
      if (client.onRefresh) {
        client.onRefresh();
      }
    } catch (error: any) {
      console.error("Error updating first meeting date:", error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile aggiornare la data",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const markFirstMeetingCompleted = async () => {
    if (!meetingDate) {
      toast({
        title: "Imposta una data",
        description: "Prima di completare il primo incontro, imposta una data",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({ 
          first_meeting_completed: true,
          first_meeting_date: meetingDate.toISOString()
        })
        .eq("id", client.id);
      
      if (error) throw error;
      
      // Log activity
      await logActivity("first_meeting_completed", "Primo incontro completato");
      
      // Update local state
      setMeetingCompleted(true);
      
      toast({
        title: "Incontro completato",
        description: "Il primo incontro è stato segnato come completato",
      });

      // Trigger refresh if callback exists
      if (client.onRefresh) {
        client.onRefresh();
      }
    } catch (error: any) {
      console.error("Error marking first meeting as completed:", error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile completare l'operazione",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const logActivity = async (action: string, notes: string) => {
    if (!client.gym_id) {
      console.error("Client gym_id is missing");
      return;
    }
    
    try {
      await supabase.from("activity_logs").insert({
        action,
        target_id: client.id,
        target_type: "client",
        user_id: user?.id,
        notes,
        gym_id: client.gym_id,
      });
    } catch (error) {
      console.error("Error logging activity:", error);
      // Continue even if activity logging fails
    }
  };

  return {
    meetingDate,
    setMeetingDate,
    meetingCompleted,
    isUpdating,
    updateFirstMeetingDate,
    markFirstMeetingCompleted,
  };
};
