
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BroadcastMessages } from "@/components/communications/BroadcastMessages";
import { UserUnavailability } from "@/components/communications/UserUnavailability";
import { MessageCircle, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Communications = () => {
  const [activeTab, setActiveTab] = useState("broadcast");
  const { user, userRole } = useAuth();
  
  // Add debug logs to help identify issues
  useEffect(() => {
    console.log("Communications page rendered with user:", user?.id);
    console.log("User role:", userRole);
    console.log("Active tab:", activeTab);
  }, [user, userRole, activeTab]);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunicazione</h1>
          <p className="text-muted-foreground">
            Gestione dei messaggi broadcast e indisponibilità dello staff
          </p>
          {/* Debug info visible in development */}
          <div className="text-xs text-muted-foreground mt-1">
            User ID: {user?.id || 'Not logged in'} | Role: {userRole || 'Unknown'}
          </div>
        </div>
      
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            console.log("Tab changed to:", value);
            setActiveTab(value);
          }}
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
