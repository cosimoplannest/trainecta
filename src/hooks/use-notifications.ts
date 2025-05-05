
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';

// Create a temporary custom type for notifications until Supabase types are regenerated
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  notification_type: 'email' | 'app' | 'both';
  user_id: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Using raw query to avoid TypeScript errors until database types are regenerated
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cast the data to our temporary type
      const typedNotifications = data as unknown as Notification[];
      setNotifications(typedNotifications || []);
      setUnreadCount(typedNotifications?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Could not fetch notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      // Using raw query to bypass TypeScript limitations
      const { error } = await supabase.rpc('mark_notification_read', { 
        p_notification_id: notificationId 
      } as any);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    
    try {
      // Using raw query to bypass TypeScript limitations
      const { data, error } = await supabase.rpc('mark_all_notifications_read') as any;

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);

      toast({
        title: "Success",
        description: `Marked ${data} notifications as read`
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Could not mark notifications as read",
        variant: "destructive"
      });
    }
  };

  const sendNotification = async ({
    userId,
    title,
    message,
    type = 'app'
  }: {
    userId: string;
    title: string;
    message: string;
    type?: 'email' | 'app' | 'both';
  }) => {
    try {
      // Using raw query to bypass TypeScript limitations
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: userId,
        p_title: title,
        p_message: message,
        p_notification_type: type
      } as any);

      if (error) throw error;

      if (type === 'email' || type === 'both') {
        const userResponse = await supabase
          .from('users')
          .select('email')
          .eq('id', userId)
          .single();
          
        if (userResponse.error) throw userResponse.error;

        const emailResponse = await supabase.functions.invoke('send-notification-email', {
          body: {
            to: userResponse.data.email,
            title: title,
            message: message,
            notificationId: data
          }
        });

        if (emailResponse.error) {
          console.error('Error sending email notification:', emailResponse.error);
        }
      }

      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
      throw error;
    }
  };

  const sendNotificationToRole = async ({
    role,
    title,
    message,
    type = 'app'
  }: {
    role: string;
    title: string;
    message: string;
    type?: 'email' | 'app' | 'both';
  }) => {
    try {
      // Using raw query to bypass TypeScript limitations
      const { data, error } = await supabase.rpc('create_notification_for_role', {
        p_role: role,
        p_title: title,
        p_message: message,
        p_notification_type: type
      } as any);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error sending role notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notifications to role",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Set up real-time subscription
      const channel = supabase
        .channel('notifications-changes')
        .on(
          'postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Notification change received:', payload);
            
            if (payload.eventType === 'INSERT') {
              // Cast to our temporary type
              const newNotification = payload.new as unknown as Notification;
              setNotifications(prev => [newNotification, ...prev]);
              if (!newNotification.read) {
                setUnreadCount(prev => prev + 1);
              }
              
              // Show toast for new notifications
              toast({
                title: newNotification.title,
                description: newNotification.message,
              });
            } else if (payload.eventType === 'UPDATE') {
              // Update the notification in the list
              setNotifications(prev => 
                prev.map(n => n.id === payload.new.id ? { ...n, ...payload.new as unknown as Notification } : n)
              );
              
              // Recalculate unread count
              fetchNotifications();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendNotification,
    sendNotificationToRole,
    fetchNotifications
  };
}
