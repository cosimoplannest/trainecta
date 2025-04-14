
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PerformanceChartProps {
  trainerData: Array<{
    name: string;
    rate: number;
  }>;
}

export const PerformanceChart = ({ trainerData }: PerformanceChartProps) => {
  // Sort by rate to show highest performers first
  const sortedData = [...trainerData].sort((a, b) => b.rate - a.rate);
  
  // Define color scale based on rate
  const getBarColor = (rate: number) => {
    if (rate > 70) return "#22c55e"; // green-500
    if (rate > 50) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  // Prepare data for recharts with color information
  const chartData = sortedData.map(trainer => ({
    name: trainer.name,
    rate: trainer.rate,
    color: getBarColor(trainer.rate)
  }));

  const config = {
    high: { label: "Conversione Alta", color: "#22c55e" },
    medium: { label: "Conversione Media", color: "#f59e0b" },
    low: { label: "Conversione Bassa", color: "#ef4444" }
  };

  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9]">
      <ChartContainer
        config={config}
        className="w-full h-full"
      >
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
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              tickMargin={20}
            />
            <YAxis 
              label={{ value: 'Tasso di Conversione (%)', angle: -90, position: 'insideLeft', dx: -20 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="rate" name="Tasso Conversione">
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
  );
};

// Custom tooltip for better visualization
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  return (
    <ChartTooltipContent>
      <div className="p-2 bg-background border rounded-md shadow-md">
        <p className="font-medium">{data.name}</p>
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: data.color }}></div>
          <span>{data.rate}% di conversione</span>
        </div>
      </div>
    </ChartTooltipContent>
  );
};
