
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Clock } from "lucide-react";
import { MyClientsCard } from "@/components/followups";

const TrackingPage = () => {
  const [activeTab, setActiveTab] = useState("firstMeeting");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracciamento Clienti</h1>
          <p className="text-muted-foreground">
            Monitoraggio dei clienti in primo incontro e follow-up
          </p>
        </div>
      
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/60">
            <TabsTrigger value="firstMeeting" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Primo Incontro
            </TabsTrigger>
            <TabsTrigger value="followup" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Follow-up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="firstMeeting">
            <MyClientsCard />
          </TabsContent>
          
          <TabsContent value="followup">
            <MyClientsCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrackingPage;
