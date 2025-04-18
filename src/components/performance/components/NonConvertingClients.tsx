
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface NonConvertingClient {
  name: string;
  trainerName: string;
  trialDate: string;
  reason: string;
}

interface NonConvertingClientsProps {
  data: NonConvertingClient[];
  loading: boolean;
}

export const NonConvertingClients = ({ data, loading }: NonConvertingClientsProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clienti Non Convertiti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Caricamento dati...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clienti Non Convertiti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Nessun cliente non convertito nel periodo selezionato</div>
        </CardContent>
      </Card>
    );
  }

  // Group reasons for summary
  const reasonsCount: Record<string, number> = {};
  data.forEach(client => {
    if (!reasonsCount[client.reason]) {
      reasonsCount[client.reason] = 0;
    }
    reasonsCount[client.reason]++;
  });

  // Sort reasons by count (highest first)
  const sortedReasons = Object.entries(reasonsCount)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5); // Top 5 reasons

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clienti Non Convertiti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Principali motivazioni di non acquisto:</h4>
          <div className="space-y-2">
            {sortedReasons.map(([reason, count], index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{reason}</span>
                  <span className="font-medium">{count} clienti</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div 
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(count / data.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Data Prova</TableHead>
                <TableHead>Motivazione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((client, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.trainerName}</TableCell>
                  <TableCell>{client.trialDate}</TableCell>
                  <TableCell>{client.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
