
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PerformanceChart } from "@/components/PerformanceChart";

export const PerformanceAnalysis = () => {
  const [period, setPeriod] = useState<string>("month");
  const [viewType, setViewType] = useState<string>("trainers");
  
  // Fetch performance data
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ["performance", period, viewType],
    queryFn: async () => {
      try {
        if (viewType === "trainers") {
          // Calculate conversion rates for trainers
          const { data: followups, error } = await supabase
            .from("client_followups")
            .select(`
              trainer_id,
              trainer:users!client_followups_trainer_id_fkey(full_name),
              purchase_confirmed
            `)
            .order("trainer_id", { ascending: true });
            
          if (error) {
            throw error;
          }
          
          // Group by trainer and calculate rates
          const trainerStats = followups.reduce((acc: any, curr: any) => {
            const trainerId = curr.trainer_id;
            const trainerName = curr.trainer?.full_name || "Non assegnato";
            
            if (!acc[trainerId]) {
              acc[trainerId] = {
                id: trainerId,
                name: trainerName,
                total: 0,
                conversions: 0,
                rate: 0
              };
            }
            
            acc[trainerId].total += 1;
            if (curr.purchase_confirmed) {
              acc[trainerId].conversions += 1;
            }
            
            return acc;
          }, {});
          
          // Calculate rates and convert to array
          return Object.values(trainerStats).map((trainer: any) => {
            trainer.rate = trainer.total > 0 
              ? Math.round((trainer.conversions / trainer.total) * 100) 
              : 0;
            return trainer;
          });
        } else {
          // Template performance data
          const { data: templates, error } = await supabase
            .from("assigned_templates")
            .select(`
              template_id,
              template:workout_templates(name),
              conversion_status
            `)
            .order("template_id", { ascending: true });
            
          if (error) {
            throw error;
          }
          
          // Group by template and calculate rates
          const templateStats = templates.reduce((acc: any, curr: any) => {
            const templateId = curr.template_id;
            const templateName = curr.template?.name || "Template rimosso";
            
            if (!acc[templateId]) {
              acc[templateId] = {
                id: templateId,
                name: templateName,
                total: 0,
                conversions: 0,
                rate: 0
              };
            }
            
            acc[templateId].total += 1;
            if (curr.conversion_status === "converted") {
              acc[templateId].conversions += 1;
            }
            
            return acc;
          }, {});
          
          // Calculate rates and convert to array
          return Object.values(templateStats).map((template: any) => {
            template.rate = template.total > 0 
              ? Math.round((template.conversions / template.total) * 100) 
              : 0;
            return template;
          });
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
        toast.error("Errore nel caricamento dei dati di performance");
        return [];
      }
    }
  });

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tasso di conversione per Trainer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : performanceData && performanceData.length > 0 ? (
                <div className="h-96">
                  <PerformanceChart trainerData={performanceData} />
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Nessun dato disponibile per il periodo selezionato</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {performanceData && performanceData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dettaglio conversioni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">Trainer</th>
                        <th className="py-3 px-4 text-left font-medium">Followup totali</th>
                        <th className="py-3 px-4 text-left font-medium">Conversioni</th>
                        <th className="py-3 px-4 text-left font-medium">Tasso conversione</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((trainer: any) => (
                        <tr key={trainer.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{trainer.name}</td>
                          <td className="py-3 px-4">{trainer.total}</td>
                          <td className="py-3 px-4">{trainer.conversions}</td>
                          <td className="py-3 px-4">
                            <span 
                              className={`px-2 py-1 rounded text-white ${
                                trainer.rate > 70 
                                  ? "bg-green-500" 
                                  : trainer.rate > 40 
                                    ? "bg-amber-500" 
                                    : "bg-red-500"
                              }`}
                            >
                              {trainer.rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Efficacia delle schede di allenamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : performanceData && performanceData.length > 0 ? (
                <div className="h-96">
                  <PerformanceChart trainerData={performanceData} />
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Nessun dato disponibile per il periodo selezionato</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {performanceData && performanceData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dettaglio schede</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">Scheda</th>
                        <th className="py-3 px-4 text-left font-medium">Assegnazioni</th>
                        <th className="py-3 px-4 text-left font-medium">Conversioni</th>
                        <th className="py-3 px-4 text-left font-medium">Tasso conversione</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((template: any) => (
                        <tr key={template.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{template.name}</td>
                          <td className="py-3 px-4">{template.total}</td>
                          <td className="py-3 px-4">{template.conversions}</td>
                          <td className="py-3 px-4">
                            <span 
                              className={`px-2 py-1 rounded text-white ${
                                template.rate > 70 
                                  ? "bg-green-500" 
                                  : template.rate > 40 
                                    ? "bg-amber-500" 
                                    : "bg-red-500"
                              }`}
                            >
                              {template.rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalysis;
