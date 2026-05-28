import { offlineDB, enqueueOperation, getCurrentUserId } from '@/modules/sync';
import type { Habit, HabitLog } from '../types';

const now = () => new Date().toISOString();

export async function listHabits(): Promise<Habit[]> {
  const userId = await getCurrentUserId();
  return offlineDB.habits.where('user_id').equals(userId).toArray();
}

export async function createHabit(name: string, frequency: 'daily' | 'weekly', target_days: number): Promise<Habit> {
  const timestamp = now();
  const habit: Habit = {
    id: crypto.randomUUID(),
    user_id: await getCurrentUserId(),
    name,
    frequency,
    target_days,
    created_at: timestamp,
    updated_at: timestamp,
  };

  await offlineDB.habits.put(habit);
  await enqueueOperation('habits', 'insert', habit.id, habit);
  return habit;
}

export async function logHabitCompletion(habit_id: string, notes: string | null = null): Promise<HabitLog> {
  const timestamp = now();
  const log: HabitLog = {
    id: crypto.randomUUID(),
    habit_id,
    user_id: await getCurrentUserId(),
    completed_at: timestamp,
    notes,
    created_at: timestamp,
  };

  await offlineDB.habit_logs.put(log);
  await enqueueOperation('habit_logs', 'insert', log.id, log);
  return log;
}

export async function getHabitLogs(habit_id: string): Promise<HabitLog[]> {
  return offlineDB.habit_logs.where('habit_id').equals(habit_id).toArray();
}

export async function calculateStreak(habit_id: string): Promise<{ currentStreak: number; bestStreak: number }> {
  const logs = await getHabitLogs(habit_id);
  if (logs.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const dates = logs.map(l => new Date(l.completed_at).toISOString().slice(0, 10)).sort().reverse();
  const uniqueDates = Array.from(new Set(dates));

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Calculate current streak
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    let checkDate = new Date(uniqueDates[0]);
    for (const d of uniqueDates) {
      if (d === checkDate.toISOString().slice(0, 10)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best streak
  let previousDate: Date | null = null;
  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const currentDate = uniqueDates[i];
    if (!currentDate) continue;

    const d = new Date(currentDate);
    if (!previousDate) {
      tempStreak = 1;
    } else {
      const diff = Math.round((d.getTime() - previousDate.getTime()) / 86400000);
      if (diff === 1) {
        tempStreak++;
      } else if (diff > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
    previousDate = d;
  }

  return { currentStreak, bestStreak };
}
