import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import ClientProfileHeader from "./profile/ClientProfileHeader";
import ClientPersonalInfo from "./profile/ClientPersonalInfo";
import ClientTabs from "./profile/ClientTabs";

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

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientData | null>(null);
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [templates, setTemplates] = useState<AssignedTemplate[]>([]);
  const [followups, setFollowups] = useState<ClientFollowup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch client profile
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select(`
            *,
            user:users!clients_assigned_to_fkey(full_name)
          `)
          .eq("id", id)
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
          .eq("target_id", id)
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
          .eq("client_id", id)
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
          .eq("client_id", id)
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
    
    fetchClientData();
  }, [id, toast]);
  
  const handleRefresh = () => {
    if (id) {
      const fetchClientData = async () => {
        try {
          const { data, error } = await supabase
            .from("clients")
            .select(`
              *,
              user:users!clients_assigned_to_fkey(full_name)
            `)
            .eq("id", id)
            .single();
            
          if (error) throw error;
          setClient(data);
        } catch (error) {
          console.error("Error refreshing client data:", error);
        }
      };
      
      fetchClientData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Caricamento dati cliente...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-xl font-semibold mb-2">Cliente non trovato</h3>
        <p className="text-muted-foreground mb-4">Il cliente richiesto non è stato trovato.</p>
        <Button onClick={() => navigate("/client-management")}>
          Torna alla lista clienti
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClientProfileHeader 
        firstName={client.first_name}
        lastName={client.last_name}
        joinedAt={client.joined_at}
      />
      
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ClientPersonalInfo client={client} onRefresh={handleRefresh} />
        </div>
        
        <div className="lg:col-span-3">
          <ClientTabs 
            templates={templates} 
            activities={activities} 
            followups={followups} 
          />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
