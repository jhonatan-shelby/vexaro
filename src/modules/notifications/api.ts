import { supabase } from '@/lib/supabase/client';
import { Notification } from './types';

export const listNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
    
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data || [];
};

export const markAsRead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
    
  if (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const markAllAsRead = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);
    
  if (error) {
    console.error('Error marking all notifications as read:', error);
  }
};
