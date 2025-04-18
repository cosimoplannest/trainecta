
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, Dumbbell, Calendar, Activity, FileCheck, AlertTriangle } from "lucide-react";
import { PerformanceChart } from "@/components/PerformanceChart";
import { TrainerPerformanceTable } from "@/components/performance/components/TrainerPerformanceTable";
import { NonConvertingClients } from "@/components/performance/components/NonConvertingClients";
import { TemplateUsageCard } from "@/components/performance/components/TemplateUsageCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Statistics = () => {
  const [trainerPerformance, setTrainerPerformance] = useState([]);
  const [clientDistribution, setClientDistribution] = useState([]);
  const [templateUsage, setTemplateUsage] = useState([]);
  const [nonConvertingClients, setNonConvertingClients] = useState([]);
  const [pendingFollowups, setPendingFollowups] = useState([]);
  const [inactiveClients, setInactiveClients] = useState([]);
  const [timeFilter, setTimeFilter] = useState("month");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        setLoading(true);
        
        // Get trainer performance data including trials and client conversion
        const { data: trainersData, error: trainersError } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            assigned_templates:assigned_templates(
              id,
              conversion_status,
              client_id
            ),
            client_followups(
              id,
              type,
              purchase_confirmed
            )
          `)
          .eq('role', 'trainer');
          
        if (trainersError) throw trainersError;
        
        const performanceData = trainersData.map(trainer => {
          const templates = trainer.assigned_templates || [];
          const followups = trainer.client_followups || [];
          
          const totalTemplates = templates.length;
          const convertedTemplates = templates.filter(t => t.conversion_status === 'converted').length;
          const conversionRate = totalTemplates > 0 ? Math.round((convertedTemplates / totalTemplates) * 100) : 0;
          
          // Count unique clients (trials)
          const uniqueClientIds = new Set();
          templates.forEach(t => uniqueClientIds.add(t.client_id));
          
          // Count active followups
          const activeFollowups = followups.filter(f => !f.purchase_confirmed).length;
          
          // Calculate estimated revenue (simplified calculation)
          const averagePackageValue = 500; // Euros
          const revenue = convertedTemplates * averagePackageValue;
          
          return {
            name: trainer.full_name,
            rate: conversionRate,
            clients: uniqueClientIds.size,
            activeFollowups: activeFollowups,
            packagesSold: convertedTemplates,
            revenue: revenue,
            templatesAssigned: totalTemplates,
            conversionRate: conversionRate
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
            assigned_templates:assigned_templates(
              id,
              conversion_status
            )
          `);
          
        if (templatesError) throw templatesError;
        
        const templateUsageData = templatesData.map(template => {
          const assignedTemplates = template.assigned_templates || [];
          const totalAssigned = assignedTemplates.length;
          const converted = assignedTemplates.filter(t => t.conversion_status === 'converted').length;
          const conversionRate = totalAssigned > 0 ? Math.round((converted / totalAssigned) * 100) : 0;
          
          return {
            name: template.name,
            count: totalAssigned,
            conversionRate: conversionRate
          };
        });
        
        // Get non-converting clients data
        const { data: questionnairesData, error: questionnairesError } = await supabase
          .from('trial_questionnaires')
          .select(`
            id,
            purchased,
            reason_not_purchased,
            custom_reason,
            client_id,
            trainer_id,
            clients!trial_questionnaires_client_id_fkey(first_name, last_name),
            users!trial_questionnaires_trainer_id_fkey(full_name)
          `)
          .eq('purchased', false);
          
        if (questionnairesError) throw questionnairesError;
        
        const nonConvertingClientsData = questionnairesData.map(item => {
          const clientName = `${item.clients?.first_name || ''} ${item.clients?.last_name || ''}`.trim() || 'Cliente sconosciuto';
          const trainerName = item.users?.full_name || 'Trainer sconosciuto';
          // Use a random past date for demonstration
          const randomDate = new Date();
          randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 60));
          
          return {
            name: clientName,
            trainerName: trainerName,
            trialDate: randomDate.toLocaleDateString('it-IT'),
            reason: item.reason_not_purchased || item.custom_reason || 'Non specificato'
          };
        });
        
        // Get pending followups (simulate for demo)
        const pendingFollowupsData = Array.from({ length: 12 }, (_, i) => {
          const randomTrainer = trainersData[Math.floor(Math.random() * trainersData.length)];
          // Use a random future date for demonstration
          const randomDate = new Date();
          randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 14) + 1);
          
          return {
            clientName: `Cliente ${i + 1}`,
            trainerName: randomTrainer?.full_name || 'Trainer sconosciuto',
            scheduledDate: randomDate.toLocaleDateString('it-IT'),
            type: Math.random() > 0.5 ? 'Prima Prova' : 'Follow-up Scheda'
          };
        });
        
        // Get inactive clients (simulate for demo)
        const inactiveClientsData = Array.from({ length: 8 }, (_, i) => {
          const randomTrainer = trainersData[Math.floor(Math.random() * trainersData.length)];
          // Random days since last activity
          const daysSinceActivity = Math.floor(Math.random() * 90) + 30;
          
          return {
            name: `Cliente Inattivo ${i + 1}`,
            trainerName: randomTrainer?.full_name || 'Trainer sconosciuto',
            lastActivity: `${daysSinceActivity} giorni fa`,
            riskLevel: daysSinceActivity > 75 ? 'Alto' : 'Medio'
          };
        });
        
        // Update state with fetched data
        setTrainerPerformance(performanceData);
        setClientDistribution(distributionData);
        setTemplateUsage(templateUsageData);
        setNonConvertingClients(nonConvertingClientsData);
        setPendingFollowups(pendingFollowupsData);
        setInactiveClients(inactiveClientsData);
        
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
  }, [toast, timeFilter]);

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
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Panoramica
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trainers" className="space-y-6">
          {/* Summary metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasso di Conversione Medio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : `${Math.round(trainerPerformance.reduce((acc, t) => acc + t.rate, 0) / (trainerPerformance.length || 1))}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Media del tasso di conversione tra tutti i trainer
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fatturato Totale</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : `€${trainerPerformance.reduce((acc, t) => acc + t.revenue, 0).toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ricavi totali da vendita pacchetti e schede
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
                  {loading ? '...' : trainerPerformance.reduce((acc, t) => acc + t.clients, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Numero totale di clienti seguiti
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
                  {loading ? '...' : trainerPerformance.reduce((acc, t) => acc + t.templatesAssigned, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Numero totale di schede assegnate
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Conversion chart */}
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
          
          {/* Detailed trainers table */}
          <Card>
            <CardHeader>
              <CardTitle>Classifica Performance Trainer</CardTitle>
            </CardHeader>
            <CardContent>
              <TrainerPerformanceTable
                data={trainerPerformance}
                loading={loading}
              />
            </CardContent>
          </Card>
          
          {/* Non-converting clients analysis */}
          <NonConvertingClients 
            data={nonConvertingClients}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TemplateUsageCard 
              data={templateUsage}
              loading={loading}
              title="Schede Più Utilizzate"
            />
            
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
        
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pending followups */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Follow-up in Attesa</CardTitle>
                <FileCheck className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Caricamento...</div>
                ) : pendingFollowups.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Trainer</TableHead>
                          <TableHead>Data Prevista</TableHead>
                          <TableHead>Tipo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingFollowups.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{item.clientName}</TableCell>
                            <TableCell>{item.trainerName}</TableCell>
                            <TableCell>{item.scheduledDate}</TableCell>
                            <TableCell>{item.type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">Nessun follow-up in attesa</div>
                )}
              </CardContent>
            </Card>
            
            {/* Inactive clients */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Clienti a Rischio Drop-off</CardTitle>
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Caricamento...</div>
                ) : inactiveClients.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Trainer</TableHead>
                          <TableHead>Ultima Attività</TableHead>
                          <TableHead>Rischio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inactiveClients.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.trainerName}</TableCell>
                            <TableCell>{item.lastActivity}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                item.riskLevel === 'Alto' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }`}>
                                {item.riskLevel}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">Nessun cliente a rischio drop-off</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasso di Conversione</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : `${Math.round(trainerPerformance.reduce((acc, trainer) => acc + trainer.rate, 0) / (trainerPerformance.length || 1))}%`}
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
