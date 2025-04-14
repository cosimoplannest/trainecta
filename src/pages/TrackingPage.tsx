
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, BarChart3, Clock } from "lucide-react";
import { FollowupManagement } from "@/components/followups/FollowupManagement";
import { ActivityLog } from "@/components/activity/ActivityLog";

const TrackingPage = () => {
  const [activeTab, setActiveTab] = useState("followups");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracciamento & Analisi</h1>
          <p className="text-muted-foreground">
            Monitoraggio delle attività, follow-up e analisi delle performance
          </p>
        </div>
      
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/60">
            <TabsTrigger value="followups" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Follow-up
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Registro Attività
            </TabsTrigger>
            <TabsTrigger value="questionnaires" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Questionari
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="followups">
            <FollowupManagement />
          </TabsContent>
          
          <TabsContent value="activities">
            <ActivityLog />
          </TabsContent>
          
          <TabsContent value="questionnaires">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-muted/50 p-8 rounded-lg text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Questionari Post-Prova</h3>
                <p className="text-muted-foreground max-w-md">
                  Questa sezione è in fase di sviluppo. Presto potrai visualizzare 
                  e gestire i questionari post-prova dei clienti.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-muted/50 p-8 rounded-lg text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Analisi Performance</h3>
                <p className="text-muted-foreground max-w-md">
                  Questa sezione è in fase di sviluppo. Presto potrai visualizzare 
                  le analisi dettagliate delle performance dei trainer e delle schede.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrackingPage;
