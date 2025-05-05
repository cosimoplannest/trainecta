
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification-types";
import { useToast } from "@/hooks/use-toast";

export function useNotificationSubscription(
  userId: string | undefined,
  onNewNotification: (notification: Notification) => void,
  onUpdateNotification: (notification: Notification) => void
) {
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Notification change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Cast to our temporary type
            const newNotification = payload.new as unknown as Notification;
            onNewNotification(newNotification);
            
            // Show toast for new notifications
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update the notification in the list
            onUpdateNotification(payload.new as unknown as Notification);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNewNotification, onUpdateNotification, toast]);
}
