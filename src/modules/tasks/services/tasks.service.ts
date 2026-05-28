import { offlineDB, enqueueOperation, getCurrentUserId } from '@/modules/sync';
import type { PomodoroSession, Task, TaskPriority, TaskStatus } from '../types';

const now = () => new Date().toISOString();

const sampleTitles = [
  'Review today priorities and lock the first focus block',
  'Prepare the weekly planning notes',
  'Audit overdue tasks before the afternoon review',
  'Draft follow-up questions for the calendar sync',
];

export async function listTasks(): Promise<Task[]> {
  const userId = await getCurrentUserId();
  const existing = await offlineDB.tasks.where('user_id').equals(userId).toArray();

  if (existing.length > 0) {
    return existing.sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  const seeded = sampleTitles.map((title, index): Task => {
    const timestamp = now();
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      status: (['backlog', 'in_progress', 'review', 'done'] as TaskStatus[])[index] ?? 'backlog',
      priority: (['medium', 'critical', 'high', 'low'] as TaskPriority[])[index] ?? 'medium',
      due_date: index < 2 ? new Date(Date.now() + index * 86400000).toISOString() : null,
      time_block_start: index === 1 ? new Date(Date.now() + 3600000).toISOString() : null,
      time_block_end: index === 1 ? new Date(Date.now() + 7200000).toISOString() : null,
      created_at: timestamp,
      updated_at: timestamp,
    };
  });

  await offlineDB.tasks.bulkPut(seeded);
  return seeded;
}

export async function createTask(title: string, priority: TaskPriority): Promise<Task> {
  const timestamp = now();
  const task: Task = {
    id: crypto.randomUUID(),
    user_id: await getCurrentUserId(),
    title,
    status: 'backlog',
    priority,
    due_date: null,
    time_block_start: null,
    time_block_end: null,
    created_at: timestamp,
    updated_at: timestamp,
  };

  await offlineDB.tasks.put(task);
  await enqueueOperation('tasks', 'insert', task.id, task);
  return task;
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const task = await offlineDB.tasks.get(id);
  if (!task) {
    return;
  }

  const updated: Task = { ...task, status, updated_at: now() };
  await offlineDB.tasks.put(updated);
  await enqueueOperation('tasks', 'update', id, updated);
}

export async function scheduleTaskBlock(id: string, startAt: string, endAt: string): Promise<void> {
  const task = await offlineDB.tasks.get(id);
  if (!task) {
    return;
  }

  const updated: Task = {
    ...task,
    time_block_start: startAt,
    time_block_end: endAt,
    updated_at: now(),
  };
  await offlineDB.tasks.put(updated);
  await enqueueOperation('tasks', 'update', id, updated);
}

export async function recordPomodoroSession(taskId: string | null, mode: PomodoroSession['mode'], completed: boolean): Promise<void> {
  const timestamp = now();
  const session: PomodoroSession = {
    id: crypto.randomUUID(),
    user_id: await getCurrentUserId(),
    task_id: taskId,
    started_at: new Date(Date.now() - (mode === 'work' ? 25 : 5) * 60000).toISOString(),
    ended_at: timestamp,
    mode,
    completed,
    created_at: timestamp,
  };

  await offlineDB.pomodoro_sessions.put(session);
  await enqueueOperation('pomodoro_sessions', 'insert', session.id, session);
}
