export type NotificationType = 'system' | 'whatsapp' | 'goal_alert' | 'calendar_alert';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}
