
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  CheckCircle, 
  XCircle,
  UserCheck,
  UserX,
  Clock,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

type PendingUserType = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  registration_date: string;
  // Note: phone field removed as it doesn't exist in the users table
};

export function PendingApprovals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<PendingUserType[]>([]);
  const [gymId, setGymId] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

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

    const fetchPendingUsers = async () => {
      setLoading(true);
      const userGymId = await fetchUserGymId();
      
      if (!userGymId) {
        setLoading(false);
        return;
      }

      try {
        // Modified query to not select the phone field
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, email, role, registration_date")
          .eq("gym_id", userGymId)
          .eq("status", "pending_approval")
          .order("registration_date", { ascending: false });

        if (error) throw error;
        setPendingUsers(data || []);
      } catch (error) {
        console.error("Error fetching pending users:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare l'elenco degli utenti in attesa",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [user]);

  const handleApproveUser = async (userId: string) => {
    if (!gymId) return;
    
    setProcessingIds(prev => [...prev, userId]);
    
    try {
      // Update user status to active
      const { error } = await supabase
        .from("users")
        .update({ status: "active" })
        .eq("id", userId)
        .eq("gym_id", gymId);

      if (error) throw error;
      
      // Log the activity
      await supabase.from("activity_logs").insert({
        user_id: user?.id,
        gym_id: gymId,
        action: "approve_user",
        target_id: userId,
        target_type: "user",
        notes: "User approved"
      });
      
      // Remove the approved user from the list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      
      toast({
        title: "Utente approvato",
        description: "L'utente può ora accedere alla piattaforma",
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile approvare l'utente",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!gymId) return;
    
    setProcessingIds(prev => [...prev, userId]);
    
    try {
      // We could either delete the user or mark them as rejected
      // For audit purposes, we'll mark them as rejected
      const { error } = await supabase
        .from("users")
        .update({ status: "rejected" })
        .eq("id", userId)
        .eq("gym_id", gymId);

      if (error) throw error;
      
      // Log the activity
      await supabase.from("activity_logs").insert({
        user_id: user?.id,
        gym_id: gymId,
        action: "reject_user",
        target_id: userId,
        target_type: "user",
        notes: "User rejected"
      });
      
      // Remove the rejected user from the list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      
      toast({
        title: "Utente rifiutato",
        description: "La richiesta è stata rifiutata",
      });
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile rifiutare l'utente",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const roleLabels: Record<string, string> = {
    admin: "Amministratore",
    operator: "Operatore",
    trainer: "Trainer",
    assistant: "Assistente",
    instructor: "Istruttore",
  };

  const roleBadgeColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    operator: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    trainer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    assistant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    instructor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const renderRoleBadge = (role: string) => {
    const label = roleLabels[role] || role;
    const colorClass = roleBadgeColors[role] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    
    return (
      <Badge className={colorClass}>
        {label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Approvazioni in attesa
        </CardTitle>
        <CardDescription>
          Approva o rifiuta le richieste di registrazione in attesa
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-muted-foreground">Nessuna richiesta in attesa di approvazione</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Data registrazione</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{renderRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {format(new Date(user.registration_date), "d MMM yyyy", { locale: it })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApproveUser(user.id)}
                        disabled={processingIds.includes(user.id)}
                      >
                        {processingIds.includes(user.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserCheck className="h-4 w-4 mr-1" />
                        )}
                        Approva
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRejectUser(user.id)}
                        disabled={processingIds.includes(user.id)}
                      >
                        {processingIds.includes(user.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserX className="h-4 w-4 mr-1" />
                        )}
                        Rifiuta
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
