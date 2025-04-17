
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, BarChart3, Clock, Users } from "lucide-react";
import { TrialClientsManagement } from "@/components/followups/TrialClientsManagement";
import { ActivityLog } from "@/components/activity/ActivityLog";
import QuestionnaireManagement from "@/components/questionnaires/QuestionnaireManagement";
import PerformanceAnalysis from "@/components/performance/PerformanceAnalysis";

const TrackingPage = () => {
  const [activeTab, setActiveTab] = useState("trialClients");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracciamento & Analisi</h1>
          <p className="text-muted-foreground">
            Monitoraggio delle attività, clienti in prova e analisi delle performance
          </p>
        </div>
      
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/60">
            <TabsTrigger value="trialClients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clienti in Prova
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
          
          <TabsContent value="trialClients">
            <TrialClientsManagement />
          </TabsContent>
          
          <TabsContent value="activities">
            <ActivityLog />
          </TabsContent>
          
          <TabsContent value="questionnaires">
            <QuestionnaireManagement />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrackingPage;
