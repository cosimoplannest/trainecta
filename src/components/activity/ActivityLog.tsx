
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, Calendar, Search, FileText, Users, Dumbbell } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  action: string;
  created_at: string;
  target_type: string;
  target_id: string;
  notes: string | null;
  user: {
    full_name: string;
  };
}

export function ActivityLog() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("activity_logs")
          .select(`
            *,
            user:users(full_name)
          `)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        setActivities(data as Activity[]);
        setFilteredActivities(data as Activity[]);
      } catch (error) {
        console.error("Error fetching activities:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le attività",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredActivities(activities);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = activities.filter(
        (activity) =>
          activity.action.toLowerCase().includes(query) ||
          activity.user?.full_name.toLowerCase().includes(query) ||
          activity.notes?.toLowerCase().includes(query)
      );
      setFilteredActivities(filtered);
    }
  }, [searchQuery, activities]);

  const getActivityIcon = (targetType: string) => {
    switch (targetType?.toLowerCase()) {
      case "client":
        return <User className="h-4 w-4 text-blue-500" />;
      case "template":
        return <Dumbbell className="h-4 w-4 text-violet-500" />;
      case "followup":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "questionnaire":
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Registro Attività</h2>
        <p className="text-muted-foreground">
          Monitora tutte le attività della palestra
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cerca attività..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Registro Attività</CardTitle>
          <CardDescription>
            Storico delle attività recenti
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utente</TableHead>
                    <TableHead>Azione</TableHead>
                    <TableHead>Data e Ora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">
                          {activity.user?.full_name || "Sistema"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {activity.action}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(activity.created_at), "d MMM yyyy, HH:mm", { locale: it })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex gap-1 items-center">
                            {getActivityIcon(activity.target_type)}
                            <span className="capitalize">
                              {activity.target_type || "Altro"}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {activity.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <span className="text-muted-foreground">Nessuna attività trovata</span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
