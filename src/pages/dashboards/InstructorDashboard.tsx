
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, Calendar, Users, ArrowUpRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Specialty {
  id: string;
  name: string;
}

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('instructor_specialty_links')
          .select(`
            specialty_id,
            instructor_specialties(id, name)
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const specialtiesData = data.map(item => ({
          id: item.specialty_id,
          name: item.instructor_specialties?.name || 'Specialità sconosciuta'
        }));

        setSpecialties(specialtiesData);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Istruttore</h2>
        <p className="text-muted-foreground">
          Benvenuto, {user?.user_metadata?.full_name || 'Istruttore'}. Gestisci i tuoi corsi.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Le tue specializzazioni:</span>
        {loading ? (
          <span className="text-sm text-muted-foreground">Caricamento...</span>
        ) : specialties.length > 0 ? (
          specialties.map(specialty => (
            <span key={specialty.id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              {specialty.name}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">Nessuna specializzazione assegnata</span>
        )}
      </div>
      
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="courses">Corsi</TabsTrigger>
          <TabsTrigger value="schedule">Calendario</TabsTrigger>
          <TabsTrigger value="unavailability">Indisponibilità</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">I Miei Corsi</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Corsi Assegnati</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza i corsi che tieni in palestra
                </p>
                <Button variant="link" className="mt-2 p-0" disabled>
                  <span className="flex items-center">
                    Visualizza <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calendario</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Orari Corsi</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza gli orari dei tuoi corsi
                </p>
                <Button variant="link" className="mt-2 p-0" disabled>
                  <span className="flex items-center">
                    Visualizza <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partecipanti</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Iscritti ai Corsi</div>
                <p className="text-xs text-muted-foreground">
                  Visualizza gli iscritti ai tuoi corsi
                </p>
                <Button variant="link" className="mt-2 p-0" disabled>
                  <span className="flex items-center">
                    Visualizza <ArrowUpRight className="h-4 w-4 ml-1" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" /> Calendario Corsi
              </CardTitle>
              <CardDescription>
                Visualizza e gestisci il calendario dei tuoi corsi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-4 text-center">
                Funzionalità di calendario corsi in arrivo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unavailability">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" /> Gestione Indisponibilità
              </CardTitle>
              <CardDescription>
                Comunica periodi di indisponibilità o richiedi sostituzione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/communications">Gestisci Indisponibilità</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorDashboard;
