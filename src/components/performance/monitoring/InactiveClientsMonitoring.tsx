
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserX } from "lucide-react";
import { usePerformanceData } from "../hooks/usePerformanceData";

export const InactiveClientsMonitoring = () => {
  const { data: trainerPerformance, isLoading } = usePerformanceData("month", "trainers");

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const inactiveClients = trainerPerformance?.filter(t => t.inactiveClients > 0) || [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-4 w-4" />
          Clienti Inattivi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Clienti Inattivi</TableHead>
                <TableHead>Ultimo Accesso</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactiveClients.length > 0 ? (
                inactiveClients.map((trainer) => (
                  <TableRow key={trainer.id}>
                    <TableCell className="font-medium">{trainer.name}</TableCell>
                    <TableCell>{trainer.inactiveClients}</TableCell>
                    <TableCell>
                      {trainer.lastActivity || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">Inattivo</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nessun cliente inattivo rilevato
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
