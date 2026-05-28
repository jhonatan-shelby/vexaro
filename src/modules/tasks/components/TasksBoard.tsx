'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Check, Clock, Flag, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { createTask, listTasks, scheduleTaskBlock, updateTaskStatus } from '../services/tasks.service';
import type { Task, TaskPriority, TaskStatus } from '../types';

const columns: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'done', label: 'Done' },
];

const priorityStyles: Record<TaskPriority, string> = {
  critical: 'border-red-200 bg-red-50 text-red-700',
  high: 'border-orange-200 bg-orange-50 text-orange-700',
  medium: 'border-lime-200 bg-lime-50 text-lime-800',
  low: 'border-slate-200 bg-slate-50 text-slate-600',
};

function formatDate(value: string | null) {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}

export function TasksBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const grouped = useMemo(
    () => columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.status === column.id),
    })),
    [tasks]
  );

  useEffect(() => {
    listTasks().then(setTasks);
  }, []);

  const refresh = async () => setTasks(await listTasks());

  const handleCreate = async () => {
    if (!title.trim()) {
      return;
    }

    await createTask(title.trim(), priority);
    setTitle('');
    await refresh();
  };

  const moveTask = async (id: string, status: TaskStatus) => {
    await updateTaskStatus(id, status);
    await refresh();
  };

  const blockNextHour = async (id: string) => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 3600000);
    await scheduleTaskBlock(id, start.toISOString(), end.toISOString());
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">New task</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Capture a task without breaking focus"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Priority</label>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
        >
          <Plus className="h-4 w-4" />
          Add task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {grouped.map((column) => (
          <section key={column.id} className="min-h-[420px] rounded-2xl border border-border bg-surface-variant/30 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{column.label}</h2>
              <span className="rounded-full bg-card px-2 py-1 text-xs font-mono text-muted-foreground">{column.tasks.length}</span>
            </div>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <article key={task.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-mono uppercase tracking-widest', priorityStyles[task.priority])}>
                      <Flag className="h-3 w-3" />
                      {task.priority}
                    </span>
                    {task.status === 'done' && <Check className="h-4 w-4 text-secondary" />}
                  </div>

                  <p className="text-sm font-semibold leading-snug text-foreground">{task.title}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(task.due_date)}
                    </span>
                    {task.time_block_start && (
                      <span className="inline-flex items-center gap-1 text-secondary">
                        <CalendarClock className="h-3 w-3" />
                        Blocked
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {columns.map((target) => (
                      <button
                        key={target.id}
                        type="button"
                        disabled={target.id === task.status}
                        onClick={() => moveTask(task.id, target.id)}
                        className="rounded-lg border border-border px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-variant hover:text-foreground disabled:cursor-default disabled:bg-secondary-container disabled:text-primary"
                      >
                        {target.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => blockNextHour(task.id)}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-variant"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Block next hour
                  </button>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
