
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock, CheckCircle, Edit, Loader2, PlusCircle, RefreshCcw, Shield, UserCog, Users } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

type User = {
  id: string;
  full_name: string;
  email: string;
  role: AppRole;
  registration_date: string;
  status: string;
};

type UserRoleDialog = {
  open: boolean;
  userId: string | null;
  userName: string;
  currentRole: AppRole | null;
};

export function UserRoleManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gymId, setGymId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [roleDialog, setRoleDialog] = useState<UserRoleDialog>({
    open: false,
    userId: null,
    userName: "",
    currentRole: null,
  });
  
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const roleLabels: Record<AppRole, string> = {
    admin: "Amministratore",
    operator: "Operatore",
    trainer: "Trainer",
    assistant: "Assistente",
    instructor: "Istruttore",
  };

  const roleColors: Record<AppRole, string> = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    operator: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    trainer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    assistant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    instructor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  useEffect(() => {
    const fetchUserGymId = async () => {
      if (!user) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("gym_id")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;
        if (userData?.gym_id) {
          setGymId(userData.gym_id);
          return userData.gym_id;
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
          .eq("gym_id", userGymId)
          .order("registration_date", { ascending: false });

        if (error) throw error;
        setUsers(data || []);
        setFilteredUsers(data || []);
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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleRoleUpdate = async (newRole: AppRole) => {
    if (!roleDialog.userId || !gymId) return;
    
    setUpdating(true);
    
    try {
      // Update the user role
      const { error: updateError } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", roleDialog.userId)
        .eq("gym_id", gymId);

      if (updateError) throw updateError;

      // Log the role change in activity_logs
      const { error: logError } = await supabase
        .from("activity_logs")
        .insert({
          gym_id: gymId,
          user_id: user?.id,
          target_id: roleDialog.userId,
          target_type: "user_role",
          action: `role_changed_to_${newRole}`,
          notes: `Changed role of ${roleDialog.userName} to ${roleLabels[newRole]}`,
        });

      if (logError) throw logError;

      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === roleDialog.userId ? { ...u, role: newRole } : u
        )
      );

      toast({
        title: "Ruolo aggiornato",
        description: `Il ruolo di ${roleDialog.userName} è stato aggiornato a ${roleLabels[newRole]}`,
      });

      // Close the dialog
      setRoleDialog({
        open: false,
        userId: null,
        userName: "",
        currentRole: null,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile aggiornare il ruolo dell'utente",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const fetchAuditTrail = async () => {
    if (!gymId) return;
    
    setLoadingAudit(true);
    
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select(`
          *,
          users:user_id (full_name, email)
        `)
        .eq("gym_id", gymId)
        .eq("target_type", "user_role")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActivityLogs(data || []);
      setShowAuditTrail(true);
    } catch (error) {
      console.error("Error fetching audit trail:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile recuperare lo storico delle modifiche",
        variant: "destructive",
      });
    } finally {
      setLoadingAudit(false);
    }
  };

  const openRoleDialog = (userId: string, userName: string, currentRole: AppRole) => {
    setRoleDialog({
      open: true,
      userId,
      userName,
      currentRole,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCog className="h-6 w-6" />
              <CardTitle>Gestione Ruoli Utente</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchAuditTrail}
                disabled={loadingAudit}
              >
                {loadingAudit ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CalendarClock className="mr-2 h-4 w-4" />
                )}
                Audit Trail
              </Button>
            </div>
          </div>
          <CardDescription>
            Gestisci i ruoli degli utenti della tua palestra e le loro autorizzazioni
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Cerca per nome o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead>Registrato il</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nessun utente trovato
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={roleColors[user.role]}>
                            {roleLabels[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.registration_date), "dd MMM yyyy", { locale: it })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Attivo" : "Inattivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRoleDialog(user.id, user.full_name, user.role)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Cambia Ruolo
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Update Dialog */}
      <Dialog
        open={roleDialog.open}
        onOpenChange={(open) => 
          setRoleDialog(prev => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Modifica Ruolo Utente
            </DialogTitle>
            <DialogDescription>
              Cambia il ruolo di {roleDialog.userName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(roleLabels) as AppRole[]).map((role) => (
                <Button
                  key={role}
                  variant={roleDialog.currentRole === role ? "default" : "outline"}
                  className={`flex items-center justify-start gap-2 ${roleDialog.currentRole === role ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => handleRoleUpdate(role)}
                  disabled={updating}
                >
                  {roleDialog.currentRole === role && <CheckCircle className="h-4 w-4" />}
                  {roleLabels[role]}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => 
                setRoleDialog({
                  open: false,
                  userId: null,
                  userName: "",
                  currentRole: null,
                })
              }
              disabled={updating}
            >
              Annulla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Trail Dialog */}
      <Dialog
        open={showAuditTrail}
        onOpenChange={setShowAuditTrail}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Audit Trail Modifiche Ruoli
            </DialogTitle>
            <DialogDescription>
              Storico delle modifiche ai ruoli utente
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {activityLogs.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                Nessuna modifica registrata
              </p>
            ) : (
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {log.action.replace("role_changed_to_", "").toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(log.created_at), "dd MMM yyyy, HH:mm", { locale: it })}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {log.notes}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Eseguito da: {log.users?.full_name || "Sistema"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowAuditTrail(false)}
            >
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
