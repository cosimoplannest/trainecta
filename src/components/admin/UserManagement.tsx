
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield,
  Users, 
  UserRound, 
  Dumbbell, 
  Loader2, 
  UserCog,
  ShieldCheck,
  Eye,
  CalendarClock,
  Ticket
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UserWithRoleType = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export function UserManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<UserWithRoleType[]>([]);
  const [operators, setOperators] = useState<UserWithRoleType[]>([]);
  const [trainers, setTrainers] = useState<UserWithRoleType[]>([]);
  const [assistants, setAssistants] = useState<UserWithRoleType[]>([]);
  const [instructors, setInstructors] = useState<UserWithRoleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [gymId, setGymId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGymId = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("gym_id")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data?.gym_id) {
          setGymId(data.gym_id);
          return data.gym_id;
        }
      } catch (error) {
        console.error("Error fetching user gym ID:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare i dati della palestra",
          variant: "destructive",
        });
        return null;
      }
    };

    const fetchUsers = async () => {
      setLoading(true);
      const userGymId = await fetchUserGymId();
      
      if (!userGymId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("gym_id", userGymId);

        if (error) throw error;

        if (data) {
          setAdmins(data.filter(u => u.role === 'admin'));
          setOperators(data.filter(u => u.role === 'operator'));
          setTrainers(data.filter(u => u.role === 'trainer'));
          setAssistants(data.filter(u => u.role === 'assistant'));
          setInstructors(data.filter(u => u.role === 'instructor'));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare l'elenco degli utenti",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const renderUserStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Attivo</Badge>;
      case 'pending':
        return <Badge variant="warning">In attesa</Badge>;
      case 'disabled':
        return <Badge variant="destructive">Disabilitato</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderUserTable = (users: UserWithRoleType[], emptyMessage: string) => {
    if (loading) {
      return <div className="flex justify-center p-6"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    if (users.length === 0) {
      return <div className="text-center text-muted-foreground p-6">{emptyMessage}</div>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{renderUserStatus(user.status)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Visualizza profilo">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div>
      <Tabs defaultValue="trainers" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="admins" className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            Amministratori
          </TabsTrigger>
          <TabsTrigger value="operators" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            Operatori
          </TabsTrigger>
          <TabsTrigger value="trainers" className="flex items-center gap-1">
            <Dumbbell className="h-4 w-4" />
            Trainer
          </TabsTrigger>
          <TabsTrigger value="assistants" className="flex items-center gap-1">
            <UserRound className="h-4 w-4" />
            Assistenti
          </TabsTrigger>
          <TabsTrigger value="instructors" className="flex items-center gap-1">
            <Ticket className="h-4 w-4" />
            Istruttori
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Amministratori
              </CardTitle>
              <CardDescription>
                Gestisci gli amministratori della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderUserTable(admins, "Nessun amministratore trovato")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operators">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Operatori
              </CardTitle>
              <CardDescription>
                Gestisci gli operatori della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderUserTable(operators, "Nessun operatore trovato")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Trainer
              </CardTitle>
              <CardDescription>
                Gestisci i trainer della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderUserTable(trainers, "Nessun trainer trovato")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistants">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Assistenti
              </CardTitle>
              <CardDescription>
                Gestisci gli assistenti della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderUserTable(assistants, "Nessun assistente trovato")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Istruttori
              </CardTitle>
              <CardDescription>
                Gestisci gli istruttori della tua palestra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderUserTable(instructors, "Nessun istruttore trovato")}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
