'use client';

import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, MessageCircle, AlertTriangle, Calendar, Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const iconMap = {
  system: Bell,
  whatsapp: MessageCircle,
  goal_alert: AlertTriangle,
  calendar_alert: Calendar,
};

export function NotificationsPanel({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsPanelProps) {
  return (
    <div className="w-80 max-h-[400px] overflow-hidden flex flex-col bg-card border border-border rounded-xl shadow-lg">
      <div className="p-4 border-b border-border flex justify-between items-center bg-surface-variant/20">
        <h3 className="font-semibold text-sm">Notifications</h3>
        <button 
          onClick={onMarkAllAsRead}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          <CheckCircle2 className="w-3 h-3" />
          Mark all as read
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto opacity-20 mb-2" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {notifications.map(notif => {
              const Icon = iconMap[notif.type] || Bell;
              return (
                <li 
                  key={notif.id}
                  className={cn(
                    "p-4 hover:bg-surface-variant/30 transition-colors cursor-pointer group flex gap-3",
                    !notif.is_read ? "bg-primary/5" : ""
                  )}
                  onClick={() => !notif.is_read && onMarkAsRead(notif.id)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    !notif.is_read ? "bg-primary text-primary-foreground" : "bg-surface-variant text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm truncate", !notif.is_read ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notif.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider font-mono">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 self-center" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
