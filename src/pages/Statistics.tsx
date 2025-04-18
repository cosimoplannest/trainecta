
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, Dumbbell, Calendar, Activity } from "lucide-react";
import { PerformanceAnalysis } from "@/components/performance/PerformanceAnalysis";
import { TemplateUsageCard } from "@/components/performance/components/TemplateUsageCard";
import { usePerformanceData } from "@/components/performance/hooks/usePerformanceData";
import { useToast } from "@/hooks/use-toast";

const Statistics = () => {
  const [timeFilter, setTimeFilter] = useState("month");
  const { toast } = useToast();

  const { 
    data: trainerPerformance, 
    isLoading: isLoadingTrainers 
  } = usePerformanceData(timeFilter, "trainers");

  const { 
    data: templateData, 
    isLoading: isLoadingTemplates 
  } = usePerformanceData(timeFilter, "templates");

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
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Panoramica
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
          <div className="grid gap-6 md:grid-cols-2">
            <TemplateUsageCard 
              data={templateData || []}
              loading={isLoadingTemplates}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Schede</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Add template performance chart here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasso di Conversione</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingTrainers ? '...' : `${Math.round((trainerPerformance || []).reduce((acc, t) => acc + t.rate, 0) / ((trainerPerformance || []).length || 1))}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Media del tasso di conversione dei trainer
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clienti Totali</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingTrainers ? '...' : (trainerPerformance || []).reduce((acc, t) => acc + t.total, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Numero totale di clienti seguiti
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schede Assegnate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingTemplates ? '...' : (templateData || []).reduce((acc, t) => acc + t.total, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Numero totale di schede assegnate
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
