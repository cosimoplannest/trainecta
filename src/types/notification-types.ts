
// Define notification-related types
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  notification_type: 'email' | 'app' | 'both';
  user_id: string;
}

export interface SendNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: 'email' | 'app' | 'both';
}

export interface SendRoleNotificationParams {
  role: string;
  title: string;
  message: string;
  type?: 'email' | 'app' | 'both';
}
