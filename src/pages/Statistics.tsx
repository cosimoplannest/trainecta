
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, Dumbbell, Calendar, Activity } from "lucide-react";
import { PerformanceAnalysis } from "@/components/performance/PerformanceAnalysis";
import { MonitoringTab } from "@/components/performance/monitoring/MonitoringTab";
import { TemplatePerformance } from "@/components/performance/templates/TemplatePerformance";
import { usePerformanceData } from "@/components/performance/hooks/usePerformanceData";

const Statistics = () => {
  const [timeFilter, setTimeFilter] = useState("month");

  const { 
    data: trainerPerformance, 
    isLoading: isLoadingTrainers 
  } = usePerformanceData(timeFilter, "trainers");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Statistiche</h2>
          <p className="text-muted-foreground">
            Analizza le prestazioni dei trainer, le vendite e l'efficacia delle schede
          </p>
        </div>
        
        <Select 
          value={timeFilter} 
          onValueChange={setTimeFilter}
        >
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Seleziona periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Ultima settimana</SelectItem>
            <SelectItem value="month">Ultimo mese</SelectItem>
            <SelectItem value="quarter">Ultimo trimestre</SelectItem>
            <SelectItem value="year">Ultimo anno</SelectItem>
            <SelectItem value="all">Tutti i dati</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="trainers" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="trainers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Performance Trainer
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Schede e Clienti
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoraggio
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trainers">
          <PerformanceAnalysis 
            trainerPerformance={trainerPerformance || []}
            loading={isLoadingTrainers}
            nonConvertingClients={[]}
          />
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplatePerformance />
        </TabsContent>
        
        <TabsContent value="monitoring">
          <MonitoringTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
