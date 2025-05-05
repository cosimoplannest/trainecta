
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityClientsList } from "./PriorityClientsList";
import { useToast } from "@/hooks/use-toast";

export const PriorityClientsSection = () => {
  const { userRole, user } = useAuth();
  const { toast } = useToast();
  const isTrainer = userRole === 'trainer';

  const { data: firstMeetingClients = [], isLoading: isLoadingFirstMeeting } = useQuery({
    queryKey: ['priority-clients', 'first-meeting', userRole, user?.id],
    queryFn: async () => {
      try {
        let query = supabase
          .from('clients')
          .select(`
            id,
            first_name,
            last_name,
            created_at,
            joined_at,
            assigned_to,
            users!clients_assigned_to_fkey(full_name)
          `)
          .eq('first_meeting_completed', false);
        
        // Filter by trainer if the user is a trainer
        if (isTrainer && user?.id) {
          query = query.eq('assigned_to', user.id);
        }
          
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          toast({
            title: "Errore",
            description: "Impossibile caricare i clienti in attesa del primo incontro",
            variant: "destructive",
          });
          throw error;
        }
        return data;
      } catch (error) {
        console.error("Error loading first meeting clients:", error);
        return [];
      }
    },
  });

  const { data: followUpClients = [], isLoading: isLoadingFollowUp } = useQuery({
    queryKey: ['priority-clients', 'follow-up', userRole, user?.id],
    queryFn: async () => {
      try {
        // Only include clients with:
        // 1. joined_at is not null (already had first meeting)
        // 2. next_confirmation_due date is in the past
        let query = supabase
          .from('clients')
          .select(`
            id,
            first_name,
            last_name,
            created_at,
            joined_at,
            assigned_to,
            next_confirmation_due,
            users!clients_assigned_to_fkey(full_name)
          `)
          .not('joined_at', 'is', null)
          .lt('next_confirmation_due', new Date().toISOString());
        
        // Filter by trainer if the user is a trainer
        if (isTrainer && user?.id) {
          query = query.eq('assigned_to', user.id);
        }
          
        const { data, error } = await query.order('next_confirmation_due', { ascending: true });

        if (error) {
          toast({
            title: "Errore",
            description: "Impossibile caricare i clienti in attesa di follow-up",
            variant: "destructive",
          });
          throw error;
        }
        return data;
      } catch (error) {
        console.error("Error loading follow-up clients:", error);
        return [];
      }
    },
  });

  return (
    <div className="grid gap-6 mb-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Clienti Primo Incontro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PriorityClientsList 
            clients={firstMeetingClients}
            loading={isLoadingFirstMeeting}
            type="first-meeting"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Clienti Follow-up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PriorityClientsList 
            clients={followUpClients}
            loading={isLoadingFollowUp}
            type="follow-up"
          />
        </CardContent>
      </Card>
    </div>
  );
};
