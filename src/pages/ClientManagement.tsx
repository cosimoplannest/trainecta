
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "@/components/clients/ClientList";
import AddClientForm from "@/components/clients/AddClientForm";

const ClientManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");

  const handleClientAdded = () => {
    toast({
      title: "Cliente aggiunto",
      description: "Il cliente è stato aggiunto con successo.",
    });
    setActiveTab("list");
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestione Clienti</h1>
        <p className="text-muted-foreground">
          Aggiungi, visualizza e gestisci i clienti della palestra.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lista Clienti
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Aggiungi Cliente
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-6">
          <ClientList />
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <AddClientForm onClientAdded={handleClientAdded} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientManagement;
