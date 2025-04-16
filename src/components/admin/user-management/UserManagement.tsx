
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield,
  UserCog,
  Dumbbell, 
  UserRound, 
  ShieldCheck,
  Ticket
} from "lucide-react";
import { UserTabContent } from "./UserTabContent";
import { useUsers } from "./useUsers";
import { UserManagementProps } from "./types";

export function UserManagement({ initialRole = null }: UserManagementProps) {
  const { admins, operators, trainers, assistants, instructors, loading } = useUsers();
  const [activeTab, setActiveTab] = useState<string>(initialRole || 'trainers');

  useEffect(() => {
    // Set the active tab based on initialRole if provided
    if (initialRole) {
      setActiveTab(initialRole);
    }
  }, [initialRole]);

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue={activeTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="admins" className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            Amministratori
          </TabsTrigger>
          <TabsTrigger value="operators" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            Operatori
          </TabsTrigger>
          <TabsTrigger value="trainers" className="flex items-center gap-1">
            <Dumbbell className="h-4 w-4" />
            Trainer
          </TabsTrigger>
          <TabsTrigger value="assistants" className="flex items-center gap-1">
            <UserRound className="h-4 w-4" />
            Assistenti
          </TabsTrigger>
          <TabsTrigger value="instructors" className="flex items-center gap-1">
            <Ticket className="h-4 w-4" />
            Istruttori
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <UserTabContent
            users={admins}
            loading={loading}
            icon={Shield}
            title="Amministratori"
            description="Gestisci gli amministratori della tua palestra"
            emptyMessage="Nessun amministratore trovato"
          />
        </TabsContent>

        <TabsContent value="operators">
          <UserTabContent
            users={operators}
            loading={loading}
            icon={UserCog}
            title="Operatori"
            description="Gestisci gli operatori della tua palestra"
            emptyMessage="Nessun operatore trovato"
          />
        </TabsContent>

        <TabsContent value="trainers">
          <UserTabContent
            users={trainers}
            loading={loading}
            icon={Dumbbell}
            title="Trainer"
            description="Gestisci i trainer della tua palestra"
            emptyMessage="Nessun trainer trovato"
          />
        </TabsContent>

        <TabsContent value="assistants">
          <UserTabContent
            users={assistants}
            loading={loading}
            icon={UserRound}
            title="Assistenti"
            description="Gestisci gli assistenti della tua palestra"
            emptyMessage="Nessun assistente trovato"
          />
        </TabsContent>

        <TabsContent value="instructors">
          <UserTabContent
            users={instructors}
            loading={loading}
            icon={Ticket}
            title="Istruttori"
            description="Gestisci gli istruttori della tua palestra"
            emptyMessage="Nessun istruttore trovato"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
