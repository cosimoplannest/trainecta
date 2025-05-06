
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ClientData } from "../types/client-types";
import { addDays } from "date-fns";

type PurchaseType = "package" | "custom_plan" | "none" | null;

interface GymSettings {
  days_to_first_followup: number;
  require_default_template_assignment: boolean;
  package_confirmation_days: number;
  custom_plan_confirmation_days: number;
}

export const usePurchaseOutcome = (client: ClientData) => {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>(client.purchase_type as PurchaseType || null);
  const [notes, setNotes] = useState(client.internal_notes || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [gymSettings, setGymSettings] = useState<GymSettings | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch gym settings on component mount
  useEffect(() => {
    const fetchGymSettings = async () => {
      if (!client.gym_id) return;
      
      try {
        const { data, error } = await supabase
          .from("gym_settings")
          .select("days_to_first_followup, require_default_template_assignment, package_confirmation_days, custom_plan_confirmation_days")
          .eq("gym_id", client.gym_id)
          .single();
          
        if (error) throw error;
        setGymSettings(data);
      } catch (error) {
        console.error("Error fetching gym settings:", error);
      }
    };
    
    fetchGymSettings();
  }, [client.gym_id]);

  // Update local state when client data changes
  useEffect(() => {
    setPurchaseType(client.purchase_type as PurchaseType || null);
    setNotes(client.internal_notes || "");
  }, [client]);

  const calculateNextConfirmationDate = (type: PurchaseType): string | null => {
    if (!gymSettings) return null;
    
    if (type === "package") {
      return addDays(new Date(), gymSettings.package_confirmation_days).toISOString();
    } else if (type === "custom_plan") {
      return addDays(new Date(), gymSettings.custom_plan_confirmation_days).toISOString();
    }
    
    return null;
  };

  const savePurchaseOutcome = async () => {
    if (!purchaseType) {
      toast({
        title: "Selezione richiesta",
        description: "Seleziona un esito per il primo incontro",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      // Calculate next confirmation date based on purchase type
      const nextConfirmationDue = calculateNextConfirmationDate(purchaseType);
      
      // Update client with purchase outcome
      const { error: updateError } = await supabase
        .from("clients")
        .update({ 
          purchase_type: purchaseType,
          internal_notes: notes || null,
          next_confirmation_due: nextConfirmationDue,
        })
        .eq("id", client.id);
      
      if (updateError) throw updateError;
      
      // Create follow-up record if "none" is selected
      if (purchaseType === "none" && gymSettings) {
        const followupDate = addDays(new Date(), gymSettings.days_to_first_followup);
        
        const { error: followupError } = await supabase
          .from("client_followups")
          .insert({
            client_id: client.id,
            trainer_id: client.assigned_to,
            type: "post_first_meeting",
            sent_at: followupDate.toISOString(),
            notes: "Follow-up automatico dopo primo incontro senza acquisto"
          });
          
        if (followupError) {
          console.error("Error creating follow-up:", followupError);
          // Don't block the process if follow-up creation fails
          toast({
            title: "Avviso",
            description: "Esito salvato, ma si è verificato un errore nella pianificazione del follow-up",
          });
        }
      }
      
      // Log activity
      await logActivity(
        "purchase_outcome_recorded", 
        `Esito primo incontro registrato: ${
          purchaseType === "package" ? "Pacchetto lezioni" : 
          purchaseType === "custom_plan" ? "Scheda personalizzata" : 
          "Nessun acquisto"
        }`
      );
      
      toast({
        title: "Esito registrato",
        description: "L'esito del primo incontro è stato registrato con successo",
      });
      
      // Force refresh of parent component
      if (client.onRefresh) {
        client.onRefresh();
      }
    } catch (error: any) {
      console.error("Error saving purchase outcome:", error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile salvare l'esito",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const logActivity = async (action: string, notes: string) => {
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
    purchaseType,
    setPurchaseType,
    notes,
    setNotes,
    isUpdating,
    savePurchaseOutcome,
    gymSettings
  };
};
