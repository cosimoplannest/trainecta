
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BroadcastMessages } from "@/components/communications/BroadcastMessages";
import { UserUnavailability } from "@/components/communications/UserUnavailability";
import { MessageCircle, Calendar } from "lucide-react";

const Communications = () => {
  const [activeTab, setActiveTab] = useState("broadcast");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunicazione</h1>
          <p className="text-muted-foreground">
            Gestione dei messaggi broadcast e indisponibilità dello staff
          </p>
        </div>
      
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/60">
            <TabsTrigger value="broadcast" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Messaggi Broadcast
            </TabsTrigger>
            <TabsTrigger value="unavailability" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Indisponibilità
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="broadcast">
            <BroadcastMessages />
          </TabsContent>
          
          <TabsContent value="unavailability">
            <UserUnavailability />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Communications;
