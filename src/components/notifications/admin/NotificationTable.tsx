
import { Notification } from "@/types/notification-types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  ArrowDown, 
  MoreVertical, 
  Eye, 
  Trash2 
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface NotificationTableProps {
  notifications: Notification[];
  loading: boolean;
  sorting: {
    column: string;
    direction: 'asc' | 'desc';
  };
  onSort: (column: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationTable({ 
  notifications, 
  loading, 
  sorting, 
  onSort,
  onDelete 
}: NotificationTableProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Apply sorting
  const sortedNotifications = [...notifications].sort((a, b) => {
    const column = sorting.column;
    const direction = sorting.direction === 'asc' ? 1 : -1;
    
    if (column === 'created_at') {
      return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    
    if (column === 'title') {
      return direction * a.title.localeCompare(b.title);
    }

    if (column === 'read') {
      return direction * (a.read === b.read ? 0 : a.read ? 1 : -1);
    }
    
    if (column === 'type') {
      return direction * a.notification_type.localeCompare(b.notification_type);
    }
    
    return 0;
  });

  const renderSortIcon = (column: string) => {
    if (sorting.column !== column) return null;
    
    return sorting.direction === 'asc' 
      ? <ArrowUp className="ml-1 h-3 w-3" /> 
      : <ArrowDown className="ml-1 h-3 w-3" />;
  };
  
  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="border rounded-md p-10 text-center text-muted-foreground">
        Nessuna notifica trovata
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort('title')}
              >
                <div className="flex items-center">
                  Titolo
                  {renderSortIcon('title')}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Messaggio</TableHead>
              <TableHead className="hidden md:table-cell">Destinatario</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort('type')}
              >
                <div className="flex items-center">
                  Tipo
                  {renderSortIcon('type')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort('read')}
              >
                <div className="flex items-center">
                  Stato
                  {renderSortIcon('read')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort('created_at')}
              >
                <div className="flex items-center">
                  Data
                  {renderSortIcon('created_at')}
                </div>
              </TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedNotifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium truncate max-w-[150px]">{notification.title}</TableCell>
                <TableCell className="hidden md:table-cell truncate max-w-[200px]">{notification.message}</TableCell>
                <TableCell className="hidden md:table-cell truncate max-w-[100px]">{notification.user_id}</TableCell>
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
                <TableCell title={format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm')}>
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
                      <DropdownMenuItem onClick={() => handleView(notification)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizza
                      </DropdownMenuItem>
                      {onDelete && (
                        <DropdownMenuItem onClick={() => onDelete(notification.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Elimina
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Notification detail dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between gap-2">
              <Badge variant={selectedNotification?.read ? "outline" : "destructive"}>
                {selectedNotification?.read ? "Letto" : "Non letto"}
              </Badge>
              
              <Badge variant={
                selectedNotification?.notification_type === 'email' ? 'outline' :
                selectedNotification?.notification_type === 'both' ? 'secondary' : 'default'
              }>
                {selectedNotification?.notification_type === 'email' ? 'Email' : 
                 selectedNotification?.notification_type === 'both' ? 'App & Email' : 'App'}
              </Badge>
            </div>
            
            <div className="border rounded-md p-4">
              <ScrollArea className="h-[200px]">
                <p className="text-sm">{selectedNotification?.message}</p>
              </ScrollArea>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Destinatario:</strong> {selectedNotification?.user_id}</p>
              <p><strong>Data invio:</strong> {selectedNotification && 
                format(new Date(selectedNotification.created_at), 'dd/MM/yyyy HH:mm:ss', {locale: it})
              }</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
