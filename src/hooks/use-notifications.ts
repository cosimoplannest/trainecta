
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { Notification } from '@/types/notification-types';
import { useNotificationSubscription } from '@/hooks/use-notification-subscription';
import { 
  fetchUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  sendNotification,
  sendNotificationToRole
} from '@/services/notification-service';

export type { Notification } from '@/types/notification-types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchNotificationsData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const notificationsData = await fetchUserNotifications(user.id);
      setNotifications(notificationsData || []);
      setUnreadCount(notificationsData?.filter(n => !n.read).length || 0);
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
  }, [user, toast]);

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;
    
    try {
      await markNotificationAsRead(notificationId);

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
  }, [user, toast]);

  const handleMarkAllAsRead = useCallback(async () => {
    if (!user) return;
    
    try {
      const updatedCount = await markAllNotificationsAsRead();

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);

      toast({
        title: "Success",
        description: `Marked ${updatedCount} notifications as read`
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Could not mark notifications as read",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const handleSendNotification = useCallback(async ({
    userId,
    title,
    message,
    type = 'app'
  }) => {
    try {
      return await sendNotification({ userId, title, message, type });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const handleSendNotificationToRole = useCallback(async ({
    role,
    title,
    message,
    type = 'app'
  }) => {
    try {
      return await sendNotificationToRole({ role, title, message, type });
    } catch (error) {
      console.error('Error sending role notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notifications to role",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Handle real-time updates
  const handleNewNotification = useCallback((newNotification: Notification) => {
    setNotifications(prev => [newNotification, ...prev]);
    if (!newNotification.read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const handleUpdateNotification = useCallback(() => {
    // When a notification is updated, refetch to get the correct state
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  // Set up subscription
  useNotificationSubscription(user?.id, handleNewNotification, handleUpdateNotification);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchNotificationsData();
    }
  }, [user, fetchNotificationsData]);

  return {
    notifications,
    loading,
    unreadCount,
    markNotificationAsRead: handleMarkAsRead,
    markAllNotificationsAsRead: handleMarkAllAsRead,
    sendNotification: handleSendNotification,
    sendNotificationToRole: handleSendNotificationToRole,
    fetchNotifications: fetchNotificationsData
  };
}
