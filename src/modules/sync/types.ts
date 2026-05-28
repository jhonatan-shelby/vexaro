export type SyncTable = 'tasks' | 'calendar_events' | 'pomodoro_sessions' | 'profiles' | 'transactions' | 'categories' | 'budgets' | 'habits' | 'habit_logs' | 'goals';
export type SyncOperation = 'insert' | 'update' | 'delete';

export interface PendingOperation {
  id?: number;
  table: SyncTable;
  operation: SyncOperation;
  payload: object;
  record_id: string;
  created_at: string;
}

export interface SyncSummary {
  pendingCount: number;
  lastReplayAt?: string;
}
