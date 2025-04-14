
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Dumbbell } from "lucide-react";
import { PerformanceChart } from "@/components/PerformanceChart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Statistics = () => {
  const [trainerPerformance, setTrainerPerformance] = useState([]);
  const [clientDistribution, setClientDistribution] = useState([]);
  const [templateUsage, setTemplateUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        setLoading(true);
        
        // Get trainer performance data
        const { data: trainersData, error: trainersError } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            assigned_templates:assigned_templates(
              id,
              conversion_status
            )
          `)
          .eq('role', 'trainer');
          
        if (trainersError) throw trainersError;
        
        const performanceData = trainersData.map(trainer => {
          const templates = trainer.assigned_templates || [];
          const total = templates.length;
          const converted = templates.filter(t => t.conversion_status === 'converted').length;
          const rate = total > 0 ? Math.round((converted / total) * 100) : 0;
          
          return {
            name: trainer.full_name,
            rate: rate
          };
        });
        
        // Get client distribution data
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('assigned_to, users!clients_assigned_to_fkey(full_name)');
          
        if (clientsError) throw clientsError;
        
        const trainerClientMap = {};
        clientsData.forEach(client => {
          if (client.assigned_to) {
            const trainerName = client.users?.full_name || 'Unknown Trainer';
            trainerClientMap[trainerName] = (trainerClientMap[trainerName] || 0) + 1;
          }
        });
        
        const distributionData = Object.keys(trainerClientMap).map(trainer => ({
          name: trainer,
          clients: trainerClientMap[trainer]
        }));
        
        // Get template usage data
        const { data: templatesData, error: templatesError } = await supabase
          .from('workout_templates')
          .select(`
            id,
            name,
            assigned_templates:assigned_templates(id)
          `);
          
        if (templatesError) throw templatesError;
        
        const templateUsageData = templatesData
          .map(template => ({
            name: template.name,
            count: (template.assigned_templates || []).length
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Get top 5 templates
        
        // Update state with fetched data
        setTrainerPerformance(performanceData);
        setClientDistribution(distributionData);
        setTemplateUsage(templateUsageData);
        
      } catch (error) {
        console.error('Error fetching statistics data:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati delle statistiche",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatisticsData();
  }, [toast]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Statistiche</h2>
        <p className="text-muted-foreground">
          Analizza le prestazioni della palestra, dei trainer e l'utilizzo delle schede.
        </p>
      </div>
      
      <Tabs defaultValue="trainers" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="trainers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Trainer
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Schede
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Panoramica
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trainers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trainer</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
              ) : (
                <PerformanceChart trainerData={trainerPerformance} />
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tasso di Conversione</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Caricamento...</div>
                ) : trainerPerformance.length > 0 ? (
                  trainerPerformance.map((trainer, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{trainer.name}</p>
                        <div className="flex items-center">
                          <TrendingUp className={`h-4 w-4 ${trainer.rate > 60 ? "text-green-500" : "text-amber-500"} mr-1`} />
                          <span className="text-sm font-medium">{trainer.rate}%</span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className={`h-2 rounded-full ${trainer.rate > 70 ? "bg-green-500" : trainer.rate > 50 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${trainer.rate}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">Nessun dato disponibile</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuzione Clienti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Caricamento...</div>
                ) : clientDistribution.length > 0 ? (
                  clientDistribution.map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{item.name}</p>
                        <span className="text-sm font-medium">{item.clients} clienti</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(100, (item.clients / Math.max(...clientDistribution.map(d => d.clients))) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">Nessun dato disponibile</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schede Più Utilizzate</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
              ) : templateUsage.length > 0 ? (
                <div className="space-y-6">
                  {templateUsage.map((template, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{template.name}</p>
                        <span className="text-sm font-medium">{template.count} assegnazioni</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(100, (template.count / Math.max(...templateUsage.map(t => t.count))) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">Nessuna scheda assegnata</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : trainerPerformance.reduce((acc, trainer) => {
                    return acc + Math.round(trainer.rate);
                  }, 0) / (trainerPerformance.length || 1)}%
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
                  {loading ? '...' : clientDistribution.reduce((acc, item) => acc + item.clients, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Numero totale di clienti assegnati
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schede Assegnate</CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : templateUsage.reduce((acc, template) => acc + template.count, 0)}
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
