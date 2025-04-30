
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientTemplates from "./ClientTemplates";
import ClientActivities from "./ClientActivities";
import ClientFollowups from "./ClientFollowups";

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

interface ClientActivity {
  id: string;
  action: string;
  created_at: string;
  notes: string | null;
  user?: { full_name: string } | null;
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

interface ClientTabsProps {
  templates: AssignedTemplate[];
  activities: ClientActivity[];
  followups: ClientFollowup[];
  clientPhone?: string;
}

const ClientTabs = ({ templates, activities, followups, clientPhone }: ClientTabsProps) => {
  return (
    <Tabs defaultValue="templates" className="space-y-6">
      <TabsList>
        <TabsTrigger value="templates">Schede Assegnate</TabsTrigger>
        <TabsTrigger value="activities">Attività</TabsTrigger>
        <TabsTrigger value="followups">Followup</TabsTrigger>
      </TabsList>
      
      <TabsContent value="templates" className="space-y-4">
        <ClientTemplates templates={templates} clientPhone={clientPhone} />
      </TabsContent>
      
      <TabsContent value="activities" className="space-y-4">
        <ClientActivities activities={activities} />
      </TabsContent>
      
      <TabsContent value="followups" className="space-y-4">
        <ClientFollowups followups={followups} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientTabs;
