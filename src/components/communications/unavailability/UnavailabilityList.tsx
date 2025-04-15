
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { FileUp, LoaderCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";
import { EmptyUnavailabilityState } from "./EmptyUnavailabilityState";

type UnavailabilityReason = Database["public"]["Enums"]["unavailability_reason"];

const reasonOptions = [
  { value: "illness" as UnavailabilityReason, label: "Malattia" },
  { value: "injury" as UnavailabilityReason, label: "Infortunio" },
  { value: "vacation" as UnavailabilityReason, label: "Ferie" },
  { value: "personal" as UnavailabilityReason, label: "Motivi personali" },
  { value: "other" as UnavailabilityReason, label: "Altro" },
];

export function UnavailabilityList() {
  const { user } = useAuth();
  const [unavailabilities, setUnavailabilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUnavailabilities();
    }
  }, [user]);

  const fetchUnavailabilities = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_unavailability")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      setUnavailabilities(data || []);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati di indisponibilità",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (unavailabilities.length === 0) {
    return <EmptyUnavailabilityState />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Motivo</TableHead>
            <TableHead>Data Inizio</TableHead>
            <TableHead>Data Fine</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Stato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unavailabilities.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {
                  reasonOptions.find(option => option.value === item.reason)?.label || 
                  item.reason
                }
              </TableCell>
              <TableCell>
                {format(new Date(item.start_date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(item.end_date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                {item.notes ? item.notes : "-"}
              </TableCell>
              <TableCell>
                {item.document_url ? (
                  <a
                    href={`https://nvzgwtgexahpnenjnhgr.supabase.co/storage/v1/object/public/documents/${item.document_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    <FileUp className="h-4 w-4 mr-1" />
                    Visualizza
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Approvato
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
