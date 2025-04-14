
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Users, Calendar, Dumbbell, BarChart2, TrendingUp, Clock } from "lucide-react";

const Dashboard = () => {
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
                <div className="text-2xl font-bold">352</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" /> +12% 
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
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 flex items-center">
                    <ArrowDown className="h-3 w-3 mr-1" /> -2%
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
                <div className="text-2xl font-bold">87</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" /> +23%
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
                <div className="text-2xl font-bold">42%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" /> +5%
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
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Cliente {i + 1}</p>
                      <p className="text-xs text-muted-foreground">Follow-up tra {i + 1} giorni</p>
                    </div>
                    <div className="text-sm text-muted-foreground">PT: Mario Rossi</div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Performance Trainer</CardTitle>
                <CardDescription>Tasso di conversione per trainer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Mario Rossi", rate: 75 },
                  { name: "Giulia Bianchi", rate: 63 },
                  { name: "Luca Verdi", rate: 48 },
                  { name: "Sara Neri", rate: 82 },
                ].map((trainer, i) => (
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
                ))}
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
            <CardContent className="pl-2">
              <div className="text-center text-muted-foreground p-8">
                I grafici dettagliati verranno visualizzati qui.
              </div>
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
