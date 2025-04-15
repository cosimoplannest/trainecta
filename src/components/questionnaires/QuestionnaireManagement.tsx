
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import QuestionnaireForm from "./QuestionnaireForm";
import EmptyQuestionnaires from "./EmptyQuestionnaires";

export const QuestionnaireManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [showForm, setShowForm] = useState(false);
  
  // Fetch questionnaires
  const { data: questionnaires, isLoading, refetch } = useQuery({
    queryKey: ["questionnaires", activeTab],
    queryFn: async () => {
      const purchased = activeTab === "completed" ? true : false;
      
      const { data, error } = await supabase
        .from("trial_questionnaires")
        .select(`
          id, 
          purchased, 
          reason_not_purchased,
          custom_reason,
          future_interest,
          created_at,
          client:clients(id, first_name, last_name),
          trainer:users(id, full_name)
        `)
        .eq(activeTab === "completed" ? "purchased" : "purchased", activeTab === "completed")
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching questionnaires:", error);
        toast.error("Errore nel caricamento dei questionari");
        return [];
      }
      
      return data || [];
    }
  });

  const handleFormClose = (refreshData?: boolean) => {
    setShowForm(false);
    if (refreshData) {
      refetch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Questionari post prova</h2>
          <p className="text-muted-foreground">
            Gestisci i questionari compilati dopo le prove gratuite
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuovo questionario
        </Button>
      </div>

      {showForm && <QuestionnaireForm onClose={handleFormClose} />}

      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="pending">Non acquistati</TabsTrigger>
          <TabsTrigger value="completed">Acquistati</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Clienti che non hanno acquistato</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : questionnaires && questionnaires.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Interesse futuro</TableHead>
                      <TableHead>Compilato il</TableHead>
                      <TableHead>Trainer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionnaires.map((q: any) => (
                      <TableRow key={q.id}>
                        <TableCell>
                          {q.client?.first_name} {q.client?.last_name}
                        </TableCell>
                        <TableCell>
                          {q.reason_not_purchased === "other" 
                            ? q.custom_reason 
                            : q.reason_not_purchased === "price" 
                              ? "Prezzo troppo alto"
                              : q.reason_not_purchased === "not_interested" 
                                ? "Non interessato"
                                : q.reason_not_purchased === "location" 
                                  ? "Posizione scomoda"
                                  : q.reason_not_purchased === "time" 
                                    ? "Orari non compatibili" 
                                    : "Altro"}
                        </TableCell>
                        <TableCell>
                          {q.future_interest ? "Sì" : "No"}
                        </TableCell>
                        <TableCell>
                          {new Date(q.created_at).toLocaleDateString("it-IT")}
                        </TableCell>
                        <TableCell>
                          {q.trainer?.full_name || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyQuestionnaires />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Clienti che hanno acquistato</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : questionnaires && questionnaires.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Compilato il</TableHead>
                      <TableHead>Trainer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionnaires.map((q: any) => (
                      <TableRow key={q.id}>
                        <TableCell>
                          {q.client?.first_name} {q.client?.last_name}
                        </TableCell>
                        <TableCell>
                          {new Date(q.created_at).toLocaleDateString("it-IT")}
                        </TableCell>
                        <TableCell>
                          {q.trainer?.full_name || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyQuestionnaires />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionnaireManagement;
