
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Users, Calendar, Dumbbell, BarChart2, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PerformanceChart } from "@/components/PerformanceChart";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    freeTrials: 0,
    assignedTemplates: 0,
    conversionRate: 0,
    clientsChange: 0,
    trialsChange: 0,
    templatesChange: 0,
    conversionChange: 0
  });
  
  const [trainerPerformance, setTrainerPerformance] = useState([]);
  const [upcomingFollowups, setUpcomingFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get total clients count
        const { count: clientCount, error: clientError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });
          
        if (clientError) throw clientError;
        
        // Get free trials (clients without subscriptions)
        const { data: freeTrialsData, error: trialsError } = await supabase
          .from('trial_questionnaires')
          .select('count(*)', { count: 'exact' })
          .eq('purchased', false);
          
        if (trialsError) throw trialsError;
        
        // Get assigned templates count
        const { count: templatesCount, error: templatesError } = await supabase
          .from('assigned_templates')
          .select('*', { count: 'exact', head: true });
          
        if (templatesError) throw templatesError;
        
        // Get conversion rate
        const { data: conversionData, error: conversionError } = await supabase
          .from('assigned_templates')
          .select('conversion_status')
          .not('conversion_status', 'eq', 'pending');
          
        if (conversionError) throw conversionError;
        
        const conversions = conversionData.filter(item => item.conversion_status === 'converted').length;
        const totalAttempts = conversionData.length;
        const conversionRate = totalAttempts > 0 ? (conversions / totalAttempts) * 100 : 0;
        
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
        
        // Get upcoming followups
        const { data: followupsData, error: followupsError } = await supabase
          .from('client_followups')
          .select(`
            id,
            client_id,
            trainer_id,
            type,
            sent_at,
            clients(first_name, last_name),
            users(full_name)
          `)
          .is('outcome', null)
          .order('sent_at', { ascending: true })
          .limit(3);
          
        if (followupsError) throw followupsError;
        
        // Update state with fetched data
        setStats({
          totalClients: clientCount || 0,
          freeTrials: freeTrialsData[0]?.count || 0,
          assignedTemplates: templatesCount || 0,
          conversionRate: Math.round(conversionRate) || 0,
          clientsChange: 12, // Hardcoded for now, would need historical data
          trialsChange: -2, // Hardcoded for now, would need historical data
          templatesChange: 23, // Hardcoded for now, would need historical data
          conversionChange: 5 // Hardcoded for now, would need historical data
        });
        
        setTrainerPerformance(performanceData);
        
        setUpcomingFollowups(followupsData.map(followup => ({
          id: followup.id,
          clientName: followup.clients?.first_name + ' ' + followup.clients?.last_name || 'Cliente',
          trainerName: followup.users?.full_name || 'PT',
          daysUntil: Math.floor(Math.random() * 3) + 1 // Placeholder calculation
        })));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati della dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Benvenuto nella dashboard di Trainecta, monitora le performance della tua palestra.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="analytics">Conversioni</TabsTrigger>
          <TabsTrigger value="workouts">Schede</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clienti Totali</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`flex items-center ${stats.clientsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.clientsChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />} 
                    {Math.abs(stats.clientsChange)}% 
                  </span>{" "}
                  rispetto al mese scorso
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prove Gratuite</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.freeTrials}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`flex items-center ${stats.trialsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.trialsChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />} 
                    {Math.abs(stats.trialsChange)}%
                  </span>{" "}
                  rispetto al mese scorso
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schede Assegnate</CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.assignedTemplates}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`flex items-center ${stats.templatesChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.templatesChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />} 
                    {Math.abs(stats.templatesChange)}%
                  </span>{" "}
                  rispetto al mese scorso
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasso Conversione</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`flex items-center ${stats.conversionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.conversionChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />} 
                    {Math.abs(stats.conversionChange)}%
                  </span>{" "}
                  rispetto al mese scorso
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Prossimi Follow-up</CardTitle>
                <CardDescription>Follow-up in programma per i clienti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Caricamento...</div>
                ) : upcomingFollowups.length > 0 ? (
                  upcomingFollowups.map((followup, i) => (
                    <div key={followup.id} className="flex items-center gap-4 rounded-lg border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{followup.clientName}</p>
                        <p className="text-xs text-muted-foreground">Follow-up tra {followup.daysUntil} giorni</p>
                      </div>
                      <div className="text-sm text-muted-foreground">PT: {followup.trainerName}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">Nessun follow-up programmato</div>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Performance Trainer</CardTitle>
                <CardDescription>Tasso di conversione per trainer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analisi Conversioni</CardTitle>
              <CardDescription>
                Dati dettagliati sulle conversioni dei personal trainer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
              ) : (
                <PerformanceChart trainerData={trainerPerformance} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle>Schede Allenamento</CardTitle>
              <CardDescription>
                Statistiche sull'utilizzo delle schede di allenamento
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="text-center text-muted-foreground p-8">
                I grafici dettagliati verranno visualizzati qui.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
