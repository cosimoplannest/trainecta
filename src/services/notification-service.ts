
import { supabase } from "@/integrations/supabase/client";
import { Notification, SendNotificationParams, SendRoleNotificationParams } from "@/types/notification-types";

export async function fetchUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications' as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const { error } = await (supabase.rpc as any)('mark_notification_read', { 
      p_notification_id: notificationId 
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(): Promise<number> {
  try {
    const { data, error } = await (supabase.rpc as any)('mark_all_notifications_read');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

export async function sendNotification({
  userId,
  title,
  message,
  type = 'app'
}: SendNotificationParams): Promise<string> {
  try {
    const { data, error } = await (supabase.rpc as any)('create_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_notification_type: type
    });

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
    throw error;
  }
}

export async function sendNotificationToRole({
  role,
  title,
  message,
  type = 'app'
}: SendRoleNotificationParams): Promise<string> {
  try {
    const { data, error } = await (supabase.rpc as any)('create_notification_for_role', {
      p_role: role,
      p_title: title,
      p_message: message,
      p_notification_type: type
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending role notification:', error);
    throw error;
  }
}
