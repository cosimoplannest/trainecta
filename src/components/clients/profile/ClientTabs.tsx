
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientTemplates from "./ClientTemplates";
import ClientActivities from "./ClientActivities";
import ClientFollowups from "./ClientFollowups";
import { AssignedTemplate } from "@/types/workout";

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
