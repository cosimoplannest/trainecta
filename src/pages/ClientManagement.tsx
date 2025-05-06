
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from "react-router-dom";
import ClientList from "@/components/clients/ClientList";
import AddClientForm from "@/components/clients/AddClientForm";
import { useAuth } from "@/hooks/use-auth";

const ClientManagement = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const tabFromUrl = searchParams.get("tab");
  
  // Only allow tab "add" if role is admin or operator
  const canAddClients = userRole === 'admin' || userRole === 'operator';
  const validTab = tabFromUrl === "add" && canAddClients ? "add" : "list";
  const [activeTab, setActiveTab] = useState(validTab);

  // If role changes, ensure we're on a valid tab
  useEffect(() => {
    if (activeTab === "add" && !canAddClients) {
      setActiveTab("list");
      navigate("/client-management");
    }
  }, [userRole, canAddClients, navigate, activeTab]);

  const handleClientAdded = () => {
    toast({
      title: "Cliente aggiunto",
      description: "Il cliente è stato aggiunto con successo.",
    });
    setActiveTab("list");
    navigate("/client-management");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "add") {
      navigate("/client-management?tab=add");
    } else {
      navigate("/client-management");
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestione Clienti</h1>
        <p className="text-muted-foreground">
          Gestisci i clienti della palestra.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lista Clienti
            </TabsTrigger>
            {canAddClients && (
              <TabsTrigger value="add" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Aggiungi Cliente
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-6">
          <ClientList />
        </TabsContent>

        {canAddClients && (
          <TabsContent value="add" className="mt-6">
            <AddClientForm onClientAdded={handleClientAdded} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ClientManagement;
