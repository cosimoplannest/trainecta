
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Dumbbell } from "lucide-react";
import { PerformanceChart } from "@/components/PerformanceChart";
import { TrainerPerformanceTable } from "./components/TrainerPerformanceTable";
import { NonConvertingClients } from "./components/NonConvertingClients";

interface PerformanceAnalysisProps {
  trainerPerformance: any[];
  loading: boolean;
  nonConvertingClients: any[];
}

export const PerformanceAnalysis = ({ 
  trainerPerformance, 
  loading, 
  nonConvertingClients 
}: PerformanceAnalysisProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
