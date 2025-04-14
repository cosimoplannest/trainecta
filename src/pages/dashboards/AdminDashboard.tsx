
import { PendingApprovals } from "@/components/admin/PendingApprovals";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell,
  UserCheck,
  Users,
  CalendarCheck,
  AreaChart,
  Activity,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTrainers: 0,
    totalWorkouts: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get the user's gym ID
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("gym_id")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;
        
        const gymId = userData?.gym_id;
        if (!gymId) return;

        // Count pending approvals
        const { count: pendingCount, error: pendingError } = await supabase
          .from("users")
          .select("id", { count: "exact" })
          .eq("gym_id", gymId)
          .eq("status", "pending_approval");

        if (pendingError) throw pendingError;
        
        // Count clients
        const { count: clientCount, error: clientError } = await supabase
          .from("clients")
          .select("id", { count: "exact" })
          .eq("gym_id", gymId);
          
        if (clientError) throw clientError;
        
        // Count trainers
        const { count: trainerCount, error: trainerError } = await supabase
          .from("users")
          .select("id", { count: "exact" })
          .eq("gym_id", gymId)
          .eq("role", "trainer")
          .eq("status", "active");
          
        if (trainerError) throw trainerError;
        
        // Count workout templates
        const { count: workoutCount, error: workoutError } = await supabase
          .from("workout_templates")
          .select("id", { count: "exact" })
          .eq("gym_id", gymId);
          
        if (workoutError) throw workoutError;
        
        setStats({
          totalClients: clientCount || 0,
          totalTrainers: trainerCount || 0,
          totalWorkouts: workoutCount || 0,
          pendingApprovals: pendingCount || 0
        });
        
        setPendingCount(pendingCount || 0);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Set up a subscription for real-time updates on users table
    const userSubscription = supabase
      .channel('users-status-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: 'status=eq.pending_approval'
      }, (payload) => {
        // Refresh the stats when a user status changes
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(userSubscription);
    };
  }, [user]);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Gestisci la tua palestra ed accedi a tutte le funzionalità</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clienti Totali</p>
                <p className="text-3xl font-bold">{stats.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trainer</p>
                <p className="text-3xl font-bold">{stats.totalTrainers}</p>
              </div>
              <Dumbbell className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Schede Allenamento</p>
                <p className="text-3xl font-bold">{stats.totalWorkouts}</p>
              </div>
              <Activity className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className={pendingCount > 0 ? "border-yellow-300 bg-yellow-50" : ""}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approvazioni in attesa</p>
                <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
              </div>
              <Clock className={`h-8 w-8 ${pendingCount > 0 ? "text-yellow-500" : "text-primary opacity-80"}`} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={pendingCount > 0 ? "approvals" : "overview"}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <AreaChart className="h-4 w-4" />
            Panoramica
          </TabsTrigger>
          
          <TabsTrigger value="approvals" className="flex items-center gap-1">
            <UserCheck className="h-4 w-4" />
            Approvazioni
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <CalendarCheck className="h-4 w-4" />
            Calendario
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          <p className="text-muted-foreground">
            Qui andranno le statistiche e i grafici principali
          </p>
        </TabsContent>
        
        <TabsContent value="approvals" className="space-y-4 mt-6">
          <PendingApprovals />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4 mt-6">
          <p className="text-muted-foreground">
            Qui andrà il calendario degli appuntamenti
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
