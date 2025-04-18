
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrainerData {
  name: string;
  clients: number;
  activeFollowups: number;
  packagesSold: number;
  revenue: number;
  templatesAssigned: number;
  conversionRate: number;
}

interface TrainerPerformanceTableProps {
  data: TrainerData[];
  loading: boolean;
}

export const TrainerPerformanceTable = ({ data, loading }: TrainerPerformanceTableProps) => {
  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Caricamento dati...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nessun dato disponibile</div>;
  }

  // Sort trainers by conversion rate, highest first
  const sortedData = [...data].sort((a, b) => b.conversionRate - a.conversionRate);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trainer</TableHead>
            <TableHead className="text-right">Clienti</TableHead>
            <TableHead className="text-right">Follow-up Attivi</TableHead>
            <TableHead className="text-right">Pacchetti Venduti</TableHead>
            <TableHead className="text-right">Fatturato</TableHead>
            <TableHead className="text-right">Schede Assegnate</TableHead>
            <TableHead className="text-right">Conversione</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((trainer, index) => {
            // Determine performance indicator
            let PerformanceIcon;
            let iconColor = "text-gray-500";
            
            if (trainer.conversionRate > 65) {
              PerformanceIcon = TrendingUp;
              iconColor = "text-green-500";
            } else if (trainer.conversionRate < 35) {
              PerformanceIcon = TrendingDown;
              iconColor = "text-red-500";
            } else {
              PerformanceIcon = Minus;
              iconColor = "text-amber-500";
            }
            
            return (
              <TableRow key={index} className={index === 0 ? "bg-muted/30" : ""}>
                <TableCell className="font-medium">{trainer.name}</TableCell>
                <TableCell className="text-right">{trainer.clients}</TableCell>
                <TableCell className="text-right">{trainer.activeFollowups}</TableCell>
                <TableCell className="text-right">{trainer.packagesSold}</TableCell>
                <TableCell className="text-right">€{trainer.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right">{trainer.templatesAssigned}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>{trainer.conversionRate}%</span>
                    <PerformanceIcon className={`h-4 w-4 ${iconColor}`} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
