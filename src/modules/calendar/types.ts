export type CalendarEventType = 'meeting' | 'task_deadline' | 'time_block' | 'goal_deadline';
export type CalendarEventSource = 'manual' | 'google' | 'task' | 'goal';

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  type: CalendarEventType;
  source: CalendarEventSource;
  meeting_link: string | null;
  task_id: string | null;
  created_at: string;
  updated_at: string;
}
