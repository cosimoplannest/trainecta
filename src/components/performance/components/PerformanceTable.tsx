
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceTableProps {
  data: Array<{
    id: string;
    name: string;
    total: number;
    conversions: number;
    rate: number;
  }>;
  type: "trainers" | "templates";
}

export const PerformanceTable = ({ data, type }: PerformanceTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dettaglio conversioni</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium">
                  {type === "trainers" ? "Trainer" : "Scheda"}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {type === "trainers" ? "Followup totali" : "Assegnazioni"}
                </th>
                <th className="py-3 px-4 text-left font-medium">Conversioni</th>
                <th className="py-3 px-4 text-left font-medium">Tasso conversione</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">{item.total}</td>
                  <td className="py-3 px-4">{item.conversions}</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`px-2 py-1 rounded text-white ${
                        item.rate > 70 
                          ? "bg-green-500" 
                          : item.rate > 40 
                            ? "bg-amber-500" 
                            : "bg-red-500"
                      }`}
                    >
                      {item.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
