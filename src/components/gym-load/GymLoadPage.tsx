
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadDashboard } from "./dashboard/LoadDashboard";
import { AttendanceForm } from "./data-entry/AttendanceForm";
import { AccessLogImport } from "./data-entry/AccessLogImport";
import { BarChart3, CalendarCheck, Upload, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function GymLoadPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { userRole } = useAuth();
  
  const isAdmin = userRole === "admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calcolatore di Carico</h1>
        <p className="text-muted-foreground">
          Analizza il carico della palestra integrando dati di accesso e presenze ai corsi
        </p>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            Presenze Corsi
          </TabsTrigger>
          <TabsTrigger value="access-logs" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Importa Accessi
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurazione
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <LoadDashboard />
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <AttendanceForm />
        </TabsContent>
        
        <TabsContent value="access-logs" className="space-y-4">
          <AccessLogImport />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="settings" className="space-y-4">
            <p className="mb-2 text-muted-foreground">
              Per configurare sale e corsi, vai alla <a href="/admin/gym-load-settings" className="text-primary underline">pagina di configurazione</a>.
            </p>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
