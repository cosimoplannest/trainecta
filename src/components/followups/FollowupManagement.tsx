
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Phone } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UpdateFollowupDialog } from "./UpdateFollowupDialog";

interface Followup {
  id: string;
  client_id: string;
  trainer_id: string;
  type: string;
  sent_at: string;
  notes: string | null;
  outcome: string | null;
  client: {
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string | null;
  };
  trainer: {
    full_name: string;
  };
}

export function FollowupManagement() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [pendingFollowups, setPendingFollowups] = useState<Followup[]>([]);
  const [completedFollowups, setCompletedFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFollowup, setCurrentFollowup] = useState<Followup | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFollowups = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("client_followups")
          .select(`
            *,
            client:clients(first_name, last_name, phone, email),
            trainer:users(full_name)
          `)
          .order("sent_at", { ascending: false });

        if (error) throw error;

        const formattedData = data as Followup[];
        setFollowups(formattedData);

        // Split into pending and completed
        setPendingFollowups(formattedData.filter(f => !f.outcome));
        setCompletedFollowups(formattedData.filter(f => f.outcome));
      } catch (error) {
        console.error("Error fetching followups:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i follow-up",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFollowups();
  }, [toast]);

  const getOutcomeStatus = (outcome: string | null) => {
    if (!outcome) return { label: "In attesa", color: "bg-amber-100 text-amber-800" };
    
    switch (outcome.toLowerCase()) {
      case "converted":
      case "acquistato":
        return { label: "Acquistato", color: "bg-green-100 text-green-800" };
      case "not_converted":
      case "non acquistato":
        return { label: "Non acquistato", color: "bg-red-100 text-red-800" };
      case "to_contact":
      case "da ricontattare":
        return { label: "Da ricontattare", color: "bg-blue-100 text-blue-800" };
      case "no_response":
      case "non risponde":
        return { label: "Non risponde", color: "bg-gray-100 text-gray-800" };
      default:
        return { label: outcome, color: "bg-gray-100 text-gray-800" };
    }
  };

  const handleUpdate = (followup: Followup) => {
    setCurrentFollowup(followup);
    setIsUpdating(true);
  };

  const onFollowupUpdated = async (followupId: string, outcome: string, notes: string) => {
    try {
      const { data, error } = await supabase
        .from("client_followups")
        .update({ outcome, notes })
        .eq("id", followupId)
        .select(`
          *,
          client:clients(first_name, last_name, phone, email),
          trainer:users(full_name)
        `)
        .single();

      if (error) throw error;

      // Update local state
      setFollowups(prev => prev.map(f => f.id === followupId ? data as Followup : f));
      
      // Update filtered lists
      if (data) {
        setPendingFollowups(prev => prev.filter(f => f.id !== followupId));
        setCompletedFollowups(prev => [data as Followup, ...prev]);
      }

      toast({
        title: "Follow-up aggiornato",
        description: "Il follow-up è stato aggiornato con successo",
      });
    } catch (error) {
      console.error("Error updating followup:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il follow-up",
        variant: "destructive",
      });
    }
  };

  const renderFollowupTable = (data: Followup[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Trainer</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((followup) => {
              const status = getOutcomeStatus(followup.outcome);
              return (
                <TableRow key={followup.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{followup.client.first_name} {followup.client.last_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {followup.client.phone || followup.client.email || "No contact info"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{followup.trainer?.full_name || "Non assegnato"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(followup.sent_at), "d MMM yyyy", { locale: it })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {followup.type === "whatsapp" 
                        ? "WhatsApp" 
                        : followup.type === "call" 
                        ? "Chiamata"
                        : followup.type === "email"
                        ? "Email"
                        : followup.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleUpdate(followup)}
                    >
                      {followup.outcome ? "Dettagli" : "Aggiorna"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <span className="text-muted-foreground">Nessun follow-up trovato</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestione dei Follow-up</h2>
        <p className="text-muted-foreground">
          Monitora e gestisci i follow-up dei clienti
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Follow-up in Attesa ({pendingFollowups.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Follow-up Completati ({completedFollowups.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Follow-up in Attesa</CardTitle>
              <CardDescription>
                Follow-up che richiedono un'azione o una risposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                renderFollowupTable(pendingFollowups)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Follow-up Completati</CardTitle>
              <CardDescription>
                Follow-up che sono stati completati con un esito
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                renderFollowupTable(completedFollowups)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UpdateFollowupDialog
        open={isUpdating}
        onOpenChange={setIsUpdating}
        followup={currentFollowup}
        onUpdate={onFollowupUpdated}
      />
    </div>
  );
}
