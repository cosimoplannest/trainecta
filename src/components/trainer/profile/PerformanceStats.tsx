
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart } from "@/components/PerformanceChart";

interface PerformanceStatsProps {
  performanceData: {
    name: string;
    rate: number;
    total: number;
    conversions: number;
  }[];
}

export const PerformanceStats = ({ performanceData }: PerformanceStatsProps) => {
  if (!performanceData?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance del Trainer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-80">
            <PerformanceChart trainerData={performanceData} />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Totale Follow-up</p>
              <p className="text-2xl font-bold">{performanceData[0].total}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Conversioni</p>
              <p className="text-2xl font-bold">{performanceData[0].conversions}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Tasso di Conversione</p>
              <p className="text-2xl font-bold">{performanceData[0].rate}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
