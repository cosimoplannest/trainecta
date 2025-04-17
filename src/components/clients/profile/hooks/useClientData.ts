
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  joined_at: string;
  internal_notes: string | null;
  assigned_to: string | null;
  user?: { full_name: string } | null;
}

interface ClientActivity {
  id: string;
  action: string;
  created_at: string;
  notes: string | null;
  user?: { full_name: string } | null;
}

interface AssignedTemplate {
  id: string;
  assigned_at: string;
  workout_template: { 
    id: string;
    name: string; 
    type: string; 
    category: string;
    template_exercises?: {
      id: string;
      sets: number;
      reps: string;
      exercise: {
        id: string;
        name: string;
        video_url?: string;
      }
    }[]
  } | null;
  assigned_by_user: { full_name: string } | null;
  delivery_status: string;
  delivery_channel: string;
  conversion_status: string | null;
}

interface ClientFollowup {
  id: string;
  created_at: string;
  sent_at: string;
  type: string;
  notes: string | null;
  trainer?: { full_name: string } | null;
  outcome: string | null;
}

export interface ClientProfileData {
  client: ClientData | null;
  activities: ClientActivity[];
  templates: AssignedTemplate[];
  followups: ClientFollowup[];
  loading: boolean;
  handleRefresh: () => void;
}

export const useClientData = (clientId: string | undefined): ClientProfileData => {
  const { toast } = useToast();
  const [client, setClient] = useState<ClientData | null>(null);
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [templates, setTemplates] = useState<AssignedTemplate[]>([]);
  const [followups, setFollowups] = useState<ClientFollowup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientData = async () => {
    if (!clientId) return;
    
    setLoading(true);
    try {
      // Fetch client profile
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select(`
          *,
          user:users!clients_assigned_to_fkey(full_name)
        `)
        .eq("id", clientId)
        .single();
        
      if (clientError) throw clientError;
      setClient(clientData);
      
      // Fetch client activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activity_logs")
        .select(`
          id,
          action,
          created_at,
          notes,
          user:users(full_name)
        `)
        .eq("target_id", clientId)
        .order("created_at", { ascending: false });
        
      if (activitiesError) throw activitiesError;
      setActivities(activitiesData);
      
      // Fetch assigned templates
      const { data: templatesData, error: templatesError } = await supabase
        .from("assigned_templates")
        .select(`
          id,
          assigned_at,
          delivery_status,
          delivery_channel,
          conversion_status,
          workout_template:workout_templates(
            id,
            name, 
            type, 
            category,
            template_exercises(
              id,
              sets,
              reps,
              exercise:exercises(
                id,
                name,
                video_url
              )
            )
          ),
          assigned_by_user:users!assigned_templates_assigned_by_fkey(full_name)
        `)
        .eq("client_id", clientId)
        .order("assigned_at", { ascending: false });
        
      if (templatesError) throw templatesError;
      setTemplates(templatesData);
      
      // Fetch client followups
      const { data: followupsData, error: followupsError } = await supabase
        .from("client_followups")
        .select(`
          id,
          created_at,
          sent_at,
          type,
          notes,
          outcome,
          trainer:users!client_followups_trainer_id_fkey(full_name)
        `)
        .eq("client_id", clientId)
        .order("sent_at", { ascending: false });
        
      if (followupsError) throw followupsError;
      setFollowups(followupsData);
      
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati del cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [clientId, toast]);

  const handleRefresh = () => {
    if (clientId) {
      fetchClientData();
    }
  };

  return {
    client,
    activities,
    templates,
    followups,
    loading,
    handleRefresh
  };
};
