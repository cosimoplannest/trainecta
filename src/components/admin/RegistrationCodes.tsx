
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Clipboard, 
  ClipboardCheck, 
  Key, 
  Loader2, 
  PlusCircle,
  RotateCcw,
  RefreshCcw,
  Trash2
} from "lucide-react";

type RegistrationCode = {
  id: string;
  code: string;
  role: string;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};

export function RegistrationCodes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [registrationCodes, setRegistrationCodes] = useState<RegistrationCode[]>([]);
  const [gymId, setGymId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCodeRole, setNewCodeRole] = useState<string>("trainer");
  const [newCodeExpires, setNewCodeExpires] = useState<boolean>(true);
  const [expireDays, setExpireDays] = useState<number>(30);
  const [copyCode, setCopyCode] = useState<string | null>(null);
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

    const fetchRegistrationCodes = async () => {
      setLoading(true);
      const userGymId = await fetchUserGymId();
      
      if (!userGymId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("gym_registration_codes")
          .select("*")
          .eq("gym_id", userGymId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRegistrationCodes(data || []);
      } catch (error) {
        console.error("Error fetching registration codes:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare i codici di registrazione",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationCodes();
  }, [user]);

  const generateRegistrationCode = () => {
    // Generate a random 6-character alphanumeric code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    return code;
  };

  const handleCreateCode = async () => {
    if (!gymId || !newCodeRole) return;
    
    setIsCreating(true);
    
    try {
      const code = generateRegistrationCode();
      
      // Cast the role string to the app_role enum type expected by Supabase
      const newCode = {
        gym_id: gymId,
        code,
        role: newCodeRole as "admin" | "operator" | "trainer" | "assistant" | "instructor",
        active: true,
        created_by: user?.id,
        expires_at: newCodeExpires ? new Date(addDays(new Date(), expireDays)).toISOString() : null
      };
      
      const { data, error } = await supabase
        .from("gym_registration_codes")
        .insert(newCode)
        .select()
        .single();

      if (error) throw error;
      
      setRegistrationCodes(prev => [data, ...prev]);
      setNewCodeRole("trainer");
      setNewCodeExpires(true);
      setExpireDays(30);
      setOpenCreate(false);
      setCopyCode(code);
      
      toast({
        title: "Codice creato",
        description: "Il codice di registrazione è stato creato con successo",
      });
    } catch (error) {
      console.error("Error creating registration code:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile creare il codice di registrazione",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopyCode(code);
    
    setTimeout(() => {
      if (setCopyCode) setCopyCode(null);
    }, 2000);
  };

  const toggleCodeStatus = async (id: string, currentStatus: boolean) => {
    if (!gymId) return;
    
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const { error } = await supabase
        .from("gym_registration_codes")
        .update({ active: !currentStatus })
        .eq("id", id)
        .eq("gym_id", gymId);

      if (error) throw error;
      
      setRegistrationCodes(prev => 
        prev.map(code => 
          code.id === id ? { ...code, active: !currentStatus } : code
        )
      );
      
      toast({
        title: !currentStatus ? "Codice attivato" : "Codice disattivato",
        description: !currentStatus 
          ? "Il codice di registrazione è stato attivato"
          : "Il codice di registrazione è stato disattivato",
      });
    } catch (error) {
      console.error("Error updating registration code:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile aggiornare lo stato del codice",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(i => i !== id));
    }
  };

  const deleteCode = async (id: string) => {
    if (!gymId) return;
    
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const { error } = await supabase
        .from("gym_registration_codes")
        .delete()
        .eq("id", id)
        .eq("gym_id", gymId);

      if (error) throw error;
      
      setRegistrationCodes(prev => 
        prev.filter(code => code.id !== id)
      );
      
      toast({
        title: "Codice eliminato",
        description: "Il codice di registrazione è stato eliminato",
      });
    } catch (error) {
      console.error("Error deleting registration code:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile eliminare il codice",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(i => i !== id));
    }
  };

  const refreshCode = async (id: string) => {
    if (!gymId) return;
    
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const newCode = generateRegistrationCode();
      
      const { error } = await supabase
        .from("gym_registration_codes")
        .update({ 
          code: newCode,
          active: true,
          expires_at: new Date(addDays(new Date(), 30)).toISOString() 
        })
        .eq("id", id)
        .eq("gym_id", gymId);

      if (error) throw error;
      
      setRegistrationCodes(prev => 
        prev.map(code => 
          code.id === id ? { 
            ...code, 
            code: newCode, 
            active: true, 
            expires_at: new Date(addDays(new Date(), 30)).toISOString() 
          } : code
        )
      );
      
      setCopyCode(newCode);
      
      toast({
        title: "Codice aggiornato",
        description: "Il codice di registrazione è stato rinnovato",
      });
    } catch (error) {
      console.error("Error refreshing registration code:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile rinnovare il codice",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(i => i !== id));
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

  const getRegistrationLink = (code: string, role: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${role}-registration/${code}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Codici di Registrazione</CardTitle>
          </div>
          <Button onClick={() => setOpenCreate(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuovo Codice
          </Button>
        </div>
        <CardDescription>
          Gestisci i codici di registrazione per il tuo staff
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : registrationCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Key className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nessun codice di registrazione disponibile</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crea un nuovo codice per consentire al tuo staff di registrarsi
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codice</TableHead>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Scadenza</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrationCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">
                          {code.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyCodeToClipboard(code.code)}
                        >
                          {copyCode === code.code ? (
                            <ClipboardCheck className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Clipboard className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleBadgeColors[code.role] || ''}>
                        {roleLabels[code.role] || code.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={code.active ? "default" : "secondary"}>
                        {code.active ? "Attivo" : "Disattivato"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {code.expires_at ? (
                        format(new Date(code.expires_at), "d MMM yyyy", { locale: it })
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Non scade
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => {
                            const link = getRegistrationLink(code.code, code.role);
                            navigator.clipboard.writeText(link);
                            toast({
                              title: "Link copiato",
                              description: "Link di registrazione copiato negli appunti",
                            });
                          }}
                        >
                          <Clipboard className="h-3.5 w-3.5 mr-1" />
                          Link
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => toggleCodeStatus(code.id, code.active)}
                          disabled={processingIds.includes(code.id)}
                        >
                          {processingIds.includes(code.id) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                              {code.active ? "Disattiva" : "Attiva"}
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => refreshCode(code.id)}
                          disabled={processingIds.includes(code.id)}
                        >
                          {processingIds.includes(code.id) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                              Rinnova
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-destructive"
                          onClick={() => deleteCode(code.id)}
                          disabled={processingIds.includes(code.id)}
                        >
                          {processingIds.includes(code.id) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuovo Codice di Registrazione</DialogTitle>
              <DialogDescription>
                Genera un codice di registrazione per il tuo staff
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role">Ruolo</Label>
                <Select
                  value={newCodeRole}
                  onValueChange={setNewCodeRole}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Seleziona un ruolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Amministratore</SelectItem>
                    <SelectItem value="operator">Operatore</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="assistant">Assistente</SelectItem>
                    <SelectItem value="instructor">Istruttore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="expires"
                    checked={newCodeExpires}
                    onCheckedChange={(checked) => setNewCodeExpires(!!checked)}
                  />
                  <Label htmlFor="expires">Imposta scadenza</Label>
                </div>
              </div>
              
              {newCodeExpires && (
                <div className="space-y-2">
                  <Label htmlFor="expireDays">Giorni di validità</Label>
                  <Input
                    id="expireDays"
                    type="number"
                    min={1}
                    value={expireDays}
                    onChange={(e) => setExpireDays(parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Annulla
              </Button>
              <Button onClick={handleCreateCode} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creazione...
                  </>
                ) : (
                  "Crea Codice"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
