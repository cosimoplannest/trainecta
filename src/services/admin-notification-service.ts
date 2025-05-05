
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification-types";

// Fetch all notifications for admin view
export async function fetchAllNotifications(): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Notification[];
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    throw error;
  }
}

// Delete a notification by ID
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications' as any)
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}
