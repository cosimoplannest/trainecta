
import React from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead 
  } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifiche</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllNotificationsAsRead} 
              className="text-xs h-8"
            >
              Segna tutti come letti
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    {notification.title}
                    {!notification.read && (
                      <span className="text-primary">
                        <CheckCircle className="h-4 w-4" />
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: it })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                {notification.notification_type !== 'app' && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.notification_type === 'email' ? 'Email' : 'Email & App'}
                    </Badge>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Nessuna notifica
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
