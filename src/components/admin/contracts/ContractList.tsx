
import { Loader2, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDuration } from "./utils";

export interface Contract {
  id: string;
  name: string;
  description?: string;
  duration_days: number;
  price?: number;
  is_active: boolean;
}

interface ContractListProps {
  contracts: Contract[];
  loading: boolean;
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
}

export function ContractList({ contracts, loading, onEdit, onDelete }: ContractListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contratti Disponibili</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nessun contratto disponibile. Crea il tuo primo contratto.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Durata</TableHead>
                  <TableHead>Prezzo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.name}</TableCell>
                    <TableCell>
                      {formatDuration(contract.duration_days)}
                    </TableCell>
                    <TableCell>€{contract.price?.toFixed(2)}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contract.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {contract.is_active ? 'Attivo' : 'Inattivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onEdit(contract)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onDelete(contract.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
