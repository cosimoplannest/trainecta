
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useGymLoad } from "../hooks/useGymLoad";
import { LoadData, DateRange } from "../types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar as CalendarIcon, Loader2, AlertTriangle } from "lucide-react";

export function LoadDashboard() {
  const [date, setDate] = useState<Date>(new Date());
  const [loadData, setLoadData] = useState<LoadData[]>([]);
  const [loading, setLoading] = useState(false);
  const { calculateLoadData } = useGymLoad();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dateString = format(date, "yyyy-MM-dd");
      const data = await calculateLoadData(dateString);
      setLoadData(data);
      setLoading(false);
    };
    
    fetchData();
  }, [date]);

  // Filter out time slots with no data (no entries)
  const chartData = loadData.filter(slot => slot.totalEntries > 0);

  const hasAlert = (data: LoadData) => {
    // Alert if class participation is less than 30% of total entries
    if (data.totalEntries > 20 && data.percentageInClasses < 30) {
      return true;
    }
    
    // Alert if any class is over 90% capacity
    if (data.classes.some(c => c.fillPercentage > 90)) {
      return true;
    }
    
    return false;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 50) return 'text-green-600';
    return 'text-blue-600';
  };

  const getPercentageBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 70) return 'bg-yellow-100';
    if (percentage >= 50) return 'bg-green-100';
    return 'bg-blue-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 items-start">
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard Carico Palestra</h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "EEEE d MMMM yyyy", { locale: it })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              locale={it}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : chartData.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground">
                Nessun dato di accesso disponibile per questa data.
                Assicurati di aver importato i dati di accesso e di aver registrato le presenze ai corsi.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Distribuzione Presenze</CardTitle>
              <CardDescription>
                Confronto tra accessi totali e partecipazione ai corsi per fascia oraria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timeSlot" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip formatter={(value, name) => {
                      if (name === "Percentuale in corsi") return `${value.toFixed(1)}%`;
                      return value;
                    }} />
                    <Legend />
                    <Bar name="Accessi totali" dataKey="totalEntries" fill="#4f46e5" />
                    <Bar name="Partecipanti corsi" dataKey="classParticipants" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analisi Dettagliata</CardTitle>
              <CardDescription>
                Dettaglio per fascia oraria con evidenza di potenziali criticità
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fascia Oraria</TableHead>
                      <TableHead className="text-right">Accessi Totali</TableHead>
                      <TableHead className="text-right">Partecipanti Corsi</TableHead>
                      <TableHead className="text-right">% in Corsi</TableHead>
                      <TableHead>Corsi Attivi</TableHead>
                      <TableHead>Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chartData.map((data, index) => (
                      <TableRow key={index} className={hasAlert(data) ? 'bg-amber-50' : ''}>
                        <TableCell className="font-medium">{data.timeSlot}</TableCell>
                        <TableCell className="text-right">{data.totalEntries}</TableCell>
                        <TableCell className="text-right">{data.classParticipants}</TableCell>
                        <TableCell className="text-right">
                          <span className={`${getPercentageColor(data.percentageInClasses)} font-medium`}>
                            {data.percentageInClasses.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {data.classes.map((c, i) => (
                              <div key={i} className="text-sm flex items-center justify-between">
                                <span>{c.name}</span>
                                <span className={`${getPercentageColor(c.fillPercentage)} ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${getPercentageBgColor(c.fillPercentage)}`}>
                                  {c.participants}/{c.capacity} ({c.fillPercentage.toFixed(0)}%)
                                </span>
                              </div>
                            ))}
                            {data.classes.length === 0 && (
                              <span className="text-xs text-muted-foreground">Nessun corso attivo</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {data.totalEntries > 20 && data.percentageInClasses < 30 && (
                            <Alert variant="warning" className="p-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle className="text-xs font-medium">Bassa Partecipazione ai Corsi</AlertTitle>
                              <AlertDescription className="text-xs">
                                Solo il {data.percentageInClasses.toFixed(1)}% dei presenti partecipa ai corsi
                              </AlertDescription>
                            </Alert>
                          )}
                          {data.classes.some(c => c.fillPercentage > 90) && (
                            <Alert variant="destructive" className="p-2 mt-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle className="text-xs font-medium">Corsi al Completo</AlertTitle>
                              <AlertDescription className="text-xs">
                                Uno o più corsi stanno raggiungendo la capienza massima
                              </AlertDescription>
                            </Alert>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
