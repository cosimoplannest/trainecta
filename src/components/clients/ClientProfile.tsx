import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, User, Calendar, Phone, Mail, Info, Clock, Edit, Users, Video } from "lucide-react";
import { format } from "date-fns";
import { AssignTrainer } from "./AssignTrainer";
import { it } from "date-fns/locale";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  joined_at: string;
  internal_notes: string | null;
  assigned_to: string | null;
  user?: { full_name: string } | null;
}

interface ClientActivity {
  id: string;
  action: string;
  created_at: string;
  notes: string | null;
  user?: { full_name: string } | null;
}

interface AssignedTemplate {
  id: string;
  assigned_at: string;
  workout_template: { 
    id: string;
    name: string; 
    type: string; 
    category: string;
    template_exercises?: {
      id: string;
      sets: number;
      reps: string;
      exercise: {
        id: string;
        name: string;
        video_url?: string;
      }
    }[]
  } | null;
  assigned_by_user: { full_name: string } | null;
  delivery_status: string;
  delivery_channel: string;
  conversion_status: string | null;
}

interface ClientFollowup {
  id: string;
  created_at: string;
  sent_at: string;
  type: string;
  notes: string | null;
  trainer?: { full_name: string } | null;
  outcome: string | null;
}

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientData | null>(null);
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [templates, setTemplates] = useState<AssignedTemplate[]>([]);
  const [followups, setFollowups] = useState<ClientFollowup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch client profile
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select(`
            *,
            user:users!clients_assigned_to_fkey(full_name)
          `)
          .eq("id", id)
          .single();
          
        if (clientError) throw clientError;
        setClient(clientData);
        
        // Fetch client activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from("activity_logs")
          .select(`
            id,
            action,
            created_at,
            notes,
            user:users(full_name)
          `)
          .eq("target_id", id)
          .order("created_at", { ascending: false });
          
        if (activitiesError) throw activitiesError;
        setActivities(activitiesData);
        
        // Fetch assigned templates
        const { data: templatesData, error: templatesError } = await supabase
          .from("assigned_templates")
          .select(`
            id,
            assigned_at,
            delivery_status,
            delivery_channel,
            conversion_status,
            workout_template:workout_templates(
              id,
              name, 
              type, 
              category,
              template_exercises(
                id,
                sets,
                reps,
                exercise:exercises(
                  id,
                  name,
                  video_url
                )
              )
            ),
            assigned_by_user:users!assigned_templates_assigned_by_fkey(full_name)
          `)
          .eq("client_id", id)
          .order("assigned_at", { ascending: false });
          
        if (templatesError) throw templatesError;
        setTemplates(templatesData);
        
        // Fetch client followups
        const { data: followupsData, error: followupsError } = await supabase
          .from("client_followups")
          .select(`
            id,
            created_at,
            sent_at,
            type,
            notes,
            outcome,
            trainer:users!client_followups_trainer_id_fkey(full_name)
          `)
          .eq("client_id", id)
          .order("sent_at", { ascending: false });
          
        if (followupsError) throw followupsError;
        setFollowups(followupsData);
        
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati del cliente",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [id, toast]);
  
  const handleRefresh = () => {
    if (id) {
      const fetchClientData = async () => {
        try {
          const { data, error } = await supabase
            .from("clients")
            .select(`
              *,
              user:users!clients_assigned_to_fkey(full_name)
            `)
            .eq("id", id)
            .single();
            
          if (error) throw error;
          setClient(data);
        } catch (error) {
          console.error("Error refreshing client data:", error);
        }
      };
      
      fetchClientData();
    }
  };

  const toggleTemplateDetails = (templateId: string) => {
    if (activeTemplate === templateId) {
      setActiveTemplate(null);
    } else {
      setActiveTemplate(templateId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Caricamento dati cliente...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-xl font-semibold mb-2">Cliente non trovato</h3>
        <p className="text-muted-foreground mb-4">Il cliente richiesto non è stato trovato.</p>
        <Button onClick={() => navigate("/client-management")}>
          Torna alla lista clienti
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/client-management")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {client.first_name} {client.last_name}
          </h2>
          <p className="text-muted-foreground">
            Cliente dal {client.joined_at && format(new Date(client.joined_at), "d MMMM yyyy", { locale: it })}
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Personali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{client.first_name} {client.last_name}</p>
                    <p className="text-sm text-muted-foreground">{client.gender || "Genere non specificato"}</p>
                  </div>
                </div>
                
                {client.birth_date && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Data di nascita</p>
                      <p className="font-medium">{format(new Date(client.birth_date), "d MMMM yyyy", { locale: it })}</p>
                    </div>
                  </div>
                )}
                
                {client.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Telefono</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                )}
                
                {client.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Trainer Assegnato</p>
                    <p className="font-medium">{client.user?.full_name || "Nessun trainer assegnato"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Data iscrizione</p>
                    <p className="font-medium">{format(new Date(client.joined_at), "d MMMM yyyy", { locale: it })}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex flex-col gap-2">
                <AssignTrainer 
                  clientId={client.id} 
                  currentTrainerId={client.assigned_to}
                  onAssigned={handleRefresh}
                />
                
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Modifica Dati
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {client.internal_notes && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Note Interne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{client.internal_notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList>
              <TabsTrigger value="templates">Schede Assegnate</TabsTrigger>
              <TabsTrigger value="activities">Attività</TabsTrigger>
              <TabsTrigger value="followups">Followup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Schede Assegnate</CardTitle>
                  <CardDescription>Schede di allenamento assegnate al cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  {templates.length > 0 ? (
                    <div className="space-y-4">
                      {templates.map((template) => (
                        <div key={template.id}>
                          <div 
                            className="flex items-start gap-4 pb-4 border-b cursor-pointer"
                            onClick={() => toggleTemplateDetails(template.id)}
                          >
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">
                                    {template.workout_template?.name || "Scheda senza nome"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                      {template.workout_template?.type || "Tipo non specificato"}
                                    </span>
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                      {template.workout_template?.category || "Categoria non specificata"}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(template.assigned_at), "d MMM yyyy", { locale: it })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  template.conversion_status === "converted" 
                                    ? "bg-green-100 text-green-800" 
                                    : template.conversion_status === "not_converted"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                  {template.conversion_status === "converted" 
                                    ? "Convertito" 
                                    : template.conversion_status === "not_converted"
                                    ? "Non Convertito"
                                    : "In attesa"}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  template.delivery_status === "delivered" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {template.delivery_status === "delivered" ? "Consegnato" : "Non consegnato"}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                                  {template.delivery_channel === "whatsapp" ? "WhatsApp" : "Email"}
                                </span>
                              </div>
                              {template.assigned_by_user && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Assegnato da: {template.assigned_by_user.full_name}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Template Details Section */}
                          {activeTemplate === template.id && template.workout_template?.template_exercises && (
                            <div className="mt-4 mb-6 pl-4 border-l-2 border-muted">
                              <h4 className="text-sm font-medium mb-2">Dettaglio Esercizi</h4>
                              <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-muted">
                                    <tr>
                                      <th className="px-4 py-2 text-left">Esercizio</th>
                                      <th className="px-4 py-2 text-center">Serie</th>
                                      <th className="px-4 py-2 text-center">Ripetizioni</th>
                                      <th className="px-4 py-2 text-right">Video</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {template.workout_template.template_exercises.map((exercise) => (
                                      <tr key={exercise.id} className="border-t border-muted">
                                        <td className="px-4 py-2">{exercise.exercise.name}</td>
                                        <td className="px-4 py-2 text-center">{exercise.sets}</td>
                                        <td className="px-4 py-2 text-center">{exercise.reps}</td>
                                        <td className="px-4 py-2 text-right">
                                          {exercise.exercise.video_url ? (
                                            <a 
                                              href={exercise.exercise.video_url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-blue-500 inline-flex items-center gap-1"
                                            >
                                              <Video className="h-4 w-4" />
                                            </a>
                                          ) : (
                                            <span className="text-muted-foreground">-</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Nessuna scheda assegnata a questo cliente
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Registro Attività</CardTitle>
                  <CardDescription>Cronologia delle attività per questo cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium capitalize">
                                  {activity.action.replace(/_/g, " ")}
                                </p>
                                {activity.notes && (
                                  <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(activity.created_at), "d MMM yyyy, HH:mm", { locale: it })}
                              </p>
                            </div>
                            {activity.user && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Da: {activity.user.full_name}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Nessuna attività registrata per questo cliente
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="followups" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Followup Programmati</CardTitle>
                  <CardDescription>Contatti programmati con il cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  {followups.length > 0 ? (
                    <div className="space-y-4">
                      {followups.map((followup) => (
                        <div key={followup.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  Followup via {followup.type === "whatsapp" 
                                    ? "WhatsApp" 
                                    : followup.type === "call" 
                                    ? "Chiamata"
                                    : followup.type === "email"
                                    ? "Email"
                                    : followup.type === "in_app"
                                    ? "App"
                                    : followup.type}
                                </p>
                                {followup.notes && (
                                  <p className="text-sm text-muted-foreground mt-1">{followup.notes}</p>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(followup.sent_at), "d MMM yyyy", { locale: it })}
                              </p>
                            </div>
                            {followup.trainer && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Da: {followup.trainer.full_name}
                              </p>
                            )}
                            {followup.outcome && (
                              <p className="text-sm font-medium mt-2">
                                Esito: {followup.outcome}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Nessun followup registrato per questo cliente
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
