
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePerformanceData } from "./hooks/usePerformanceData";
import { PerformanceChartCard } from "./components/PerformanceChartCard";
import { PerformanceTable } from "./components/PerformanceTable";

export const PerformanceAnalysis = () => {
  const [period, setPeriod] = useState<string>("month");
  const [viewType, setViewType] = useState<string>("trainers");
  
  const { data: performanceData, isLoading } = usePerformanceData(period, viewType);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analisi Performance</h2>
          <p className="text-muted-foreground">
            Visualizza e analizza le performance dei trainer e delle schede
          </p>
        </div>
        
        <Select 
          value={period} 
          onValueChange={setPeriod}
        >
          <SelectTrigger className="w-[180px]">
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

      <Tabs 
        value={viewType}
        onValueChange={setViewType}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="trainers">Performance Trainer</TabsTrigger>
          <TabsTrigger value="templates">Performance Schede</TabsTrigger>
        </TabsList>

        <TabsContent value="trainers" className="space-y-4">
          <PerformanceChartCard
            title="Tasso di conversione per Trainer"
            loading={isLoading}
            data={performanceData}
          />
          
          {performanceData && performanceData.length > 0 && (
            <PerformanceTable 
              data={performanceData}
              type="trainers"
            />
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <PerformanceChartCard
            title="Efficacia delle schede di allenamento"
            loading={isLoading}
            data={performanceData}
          />
          
          {performanceData && performanceData.length > 0 && (
            <PerformanceTable 
              data={performanceData}
              type="templates"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalysis;
