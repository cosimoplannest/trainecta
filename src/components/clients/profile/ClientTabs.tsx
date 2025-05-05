
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientTemplates from "./ClientTemplates";
import ClientActivities from "./ClientActivities";
import ClientFollowups from "./ClientFollowups";
import { AssignedTemplate } from "@/types/workout";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClipboardList, FileText, Clock } from "lucide-react";

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
  const isMobile = useIsMobile();
  
  return (
    <Tabs defaultValue="templates" className="space-y-4">
      <TabsList className={`${isMobile ? 'w-full grid grid-cols-3' : ''}`}>
        <TabsTrigger value="templates" className={isMobile ? 'flex items-center justify-center gap-1 py-2' : ''}>
          {isMobile && <ClipboardList className="h-4 w-4" />}
          <span className={isMobile ? "text-xs" : ""}>Schede</span>
        </TabsTrigger>
        <TabsTrigger value="activities" className={isMobile ? 'flex items-center justify-center gap-1 py-2' : ''}>
          {isMobile && <FileText className="h-4 w-4" />}
          <span className={isMobile ? "text-xs" : ""}>Attività</span>
        </TabsTrigger>
        <TabsTrigger value="followups" className={isMobile ? 'flex items-center justify-center gap-1 py-2' : ''}>
          {isMobile && <Clock className="h-4 w-4" />}
          <span className={isMobile ? "text-xs" : ""}>Followup</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="templates" className="space-y-4 pt-2">
        <ClientTemplates templates={templates} clientPhone={clientPhone} />
      </TabsContent>
      
      <TabsContent value="activities" className="space-y-4 pt-2">
        <ClientActivities activities={activities} />
      </TabsContent>
      
      <TabsContent value="followups" className="space-y-4 pt-2">
        <ClientFollowups followups={followups} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientTabs;
