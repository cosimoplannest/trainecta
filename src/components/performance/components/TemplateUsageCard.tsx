
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface TemplateData {
  name: string;
  count: number;
  conversionRate: number;
}

interface TemplateUsageCardProps {
  data: TemplateData[];
  loading: boolean;
  title?: string;
}

export const TemplateUsageCard = ({ 
  data, 
  loading, 
  title = "Schede Più Utilizzate" 
}: TemplateUsageCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Caricamento dati...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Nessun dato disponibile</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort templates by usage count (highest first)
  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 templates

  const getBarColor = (rate: number) => {
    if (rate > 65) return "#22c55e"; // green
    if (rate > 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  // Add color to each item
  const chartData = sortedData.map(item => ({
    ...item,
    color: getBarColor(item.conversionRate)
  }));

  const config = {
    template: { label: "Utilizzo Schede", color: "#6366f1" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={36}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tickMargin={25}
                />
                <YAxis
                  label={{ 
                    value: 'Numero di Assegnazioni', 
                    angle: -90, 
                    position: 'insideLeft', 
                    dx: -10 
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    
                    const data = payload[0].payload;
                    return (
                      <ChartTooltipContent>
                        <div className="p-2 bg-background border rounded-md shadow-md">
                          <p className="font-medium text-sm">{data.name}</p>
                          <div className="text-sm mt-1">
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: data.color }}
                              ></div>
                              <span>{data.count} assegnazioni</span>
                            </div>
                            <div className="mt-1">
                              <span>Tasso di conversione: {data.conversionRate}%</span>
                            </div>
                          </div>
                        </div>
                      </ChartTooltipContent>
                    );
                  }}
                />
                <Bar 
                  dataKey="count" 
                  name="Utilizzo"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <rect
                      key={`rect-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
