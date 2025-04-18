
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityClientsList } from "./PriorityClientsList";
import { useToast } from "@/hooks/use-toast";

export const PriorityClientsSection = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();

  const { data: firstMeetingClients = [], isLoading: isLoadingFirstMeeting } = useQuery({
    queryKey: ['priority-clients', 'first-meeting'],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .eq('first_meeting_completed', false)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Errore",
          description: "Impossibile caricare i clienti in attesa del primo incontro",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  const { data: followUpClients = [], isLoading: isLoadingFollowUp } = useQuery({
    queryKey: ['priority-clients', 'follow-up'],
    queryFn: async () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const { data, error } = await supabase
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
        .lt('next_confirmation_due', new Date().toISOString())
        .order('next_confirmation_due', { ascending: true });

      if (error) {
        toast({
          title: "Errore",
          description: "Impossibile caricare i clienti in attesa di follow-up",
          variant: "destructive",
        });
        throw error;
      }
      return data;
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
