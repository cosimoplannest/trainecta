
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface PerformanceChartCardProps {
  data: any[];
  loading?: boolean;
}

export const PerformanceChartCard = ({ data, loading }: PerformanceChartCardProps) => {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Caricamento dati...</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="rate" fill="#22c55e" name="Tasso di Conversione %" />
      </BarChart>
    </ResponsiveContainer>
  );
};
