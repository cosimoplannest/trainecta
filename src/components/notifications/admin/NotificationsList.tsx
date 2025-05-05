
import { useState, useEffect } from "react";
import { Notification } from "@/types/notification-types";
import { 
  fetchAllNotifications,
  deleteNotification 
} from "@/services/admin-notification-service";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  MoreVertical, 
  Trash2, 
  Search,
  RefreshCw,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const { toast } = useToast();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le notifiche",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast({
        title: "Notifica eliminata",
        description: "La notifica è stata eliminata con successo"
      });
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare la notifica",
        variant: "destructive"
      });
    }
  };

  // Filter notifications based on search term and filters
  const filteredNotifications = notifications.filter(notification => {
    // Text search
    const matchesSearch = 
      searchTerm === "" || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = 
      typeFilter === "all" || 
      notification.notification_type === typeFilter;
    
    // Read status filter
    const matchesRead = 
      readFilter === "all" || 
      (readFilter === "read" ? notification.read : !notification.read);
    
    return matchesSearch && matchesType && matchesRead;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca notifiche..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button
            variant="outline"
            onClick={loadNotifications}
            className="flex-shrink-0"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Aggiorna
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo di notifica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i tipi</SelectItem>
              <SelectItem value="app">Solo app</SelectItem>
              <SelectItem value="email">Solo email</SelectItem>
              <SelectItem value="both">App & Email</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger className="w-[180px]">
              <CheckCircle className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Stato lettura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="read">Letti</SelectItem>
              <SelectItem value="unread">Non letti</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead>Messaggio</TableHead>
                <TableHead>Utente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                  <TableCell>{notification.user_id}</TableCell>
                  <TableCell>
                    <Badge variant={
                      notification.notification_type === 'email' ? 'outline' :
                      notification.notification_type === 'both' ? 'secondary' : 'default'
                    }>
                      {notification.notification_type === 'email' ? 'Email' : 
                       notification.notification_type === 'both' ? 'App & Email' : 'App'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={notification.read ? "outline" : "destructive"}>
                      {notification.read ? "Letto" : "Non letto"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: it })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog open={confirmDeleteId === notification.id} onOpenChange={(open) => {
                          if (!open) setConfirmDeleteId(null);
                        }}>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              setConfirmDeleteId(notification.id);
                            }}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Elimina
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Conferma eliminazione</DialogTitle>
                              <DialogDescription>
                                Sei sicuro di voler eliminare questa notifica? Questa azione non può essere annullata.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Annulla</Button>
                              </DialogClose>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                Elimina
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-10 text-center text-muted-foreground">
          Nessuna notifica trovata
        </div>
      )}
    </div>
  );
}
