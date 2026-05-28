import Dexie, { type Table } from 'dexie';
import type { CalendarEvent } from '@/modules/calendar';
import type { Task, PomodoroSession } from '@/modules/tasks';
import type { UserPreferences } from '@/modules/settings';
import type { PendingOperation } from '../types';
import type { Transaction, Category, Budget } from '@/modules/finance';
import type { Habit, HabitLog } from '@/modules/habits';
import type { Goal } from '@/modules/goals';

export class VexaroOfflineDB extends Dexie {
  tasks!: Table<Task, string>;
  calendar_events!: Table<CalendarEvent, string>;
  pomodoro_sessions!: Table<PomodoroSession, string>;
  profiles!: Table<UserPreferences, string>;
  transactions!: Table<Transaction, string>;
  categories!: Table<Category, string>;
  budgets!: Table<Budget, string>;
  habits!: Table<Habit, string>;
  habit_logs!: Table<HabitLog, string>;
  goals!: Table<Goal, string>;
  pendingOps!: Table<PendingOperation, number>;

  constructor() {
    super('vexaro-offline');
    this.version(3).stores({
      tasks: 'id, user_id, status, priority, due_date, updated_at',
      calendar_events: 'id, user_id, start_at, end_at, type, source, task_id, updated_at',
      pomodoro_sessions: 'id, user_id, task_id, started_at, completed',
      profiles: 'id, language, theme, updated_at',
      transactions: 'id, user_id, date, category_id',
      categories: 'id, user_id',
      budgets: 'id, user_id, category_id',
      habits: 'id, user_id',
      habit_logs: 'id, habit_id, user_id, completed_at',
      goals: 'id, user_id, type, due_date',
      pendingOps: '++id, table, operation, record_id, created_at',
    });
  }
}

export const offlineDB = new VexaroOfflineDB();
