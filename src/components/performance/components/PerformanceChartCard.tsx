
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PerformanceChart } from "@/components/PerformanceChart";

interface PerformanceChartCardProps {
  title: string;
  loading: boolean;
  data: Array<{
    name: string;
    rate: number;
  }> | undefined;
}

export const PerformanceChartCard = ({ title, loading, data }: PerformanceChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="h-96">
            <PerformanceChart trainerData={data} />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nessun dato disponibile per il periodo selezionato</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
