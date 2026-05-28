'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Wifi } from 'lucide-react';
import { listCalendarEvents, type CalendarEvent } from '@/modules/calendar';
import { listTasks, type Task, PomodoroTimer } from '@/modules/tasks';
import { getSyncSummary } from '@/modules/sync';
import { FlowChart } from './FlowChart';
import { KpiCard } from './KpiCard';

export function DashboardShell() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [pendingOps, setPendingOps] = useState(0);

  useEffect(() => {
    listTasks().then(setTasks);
    listCalendarEvents().then(setEvents);
    getSyncSummary().then((summary) => setPendingOps(summary.pendingCount));
  }, []);

  const todayKey = new Date().toISOString().slice(0, 10);
  const priorityTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'done' && ['critical', 'high'].includes(task.priority)).slice(0, 4),
    [tasks]
  );
  const todaysEvents = useMemo(
    () => events.filter((event) => event.start_at.slice(0, 10) === todayKey).slice(0, 4),
    [events, todayKey]
  );
  const completed = tasks.filter((task) => task.status === 'done').length;
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Priority Tasks" value={String(priorityTasks.length)} subtext="Critical and high" icon={CheckCircle2} trend="neutral" />
        <KpiCard label="Today Meetings" value={String(todaysEvents.length)} subtext="Calendar agenda" icon={CalendarDays} trend="neutral" />
        <KpiCard label="Completion" value={`${completionRate}%`} subtext={`${completed}/${tasks.length} tasks`} icon={Clock3} trend="up" progress={completionRate} />
        <KpiCard label="Offline Queue" value={String(pendingOps)} subtext="Pending sync ops" icon={Wifi} trend={pendingOps > 0 ? 'down' : 'up'} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Control chart</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">Productivity pressure</h2>
            </div>
            <span className="rounded-full bg-surface-variant/50 px-3 py-1 text-xs font-mono text-muted-foreground">30 days</span>
          </div>
          <FlowChart />
        </section>

        <PomodoroTimer />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Priority lane</p>
          <div className="mt-4 space-y-3">
            {priorityTasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-surface-variant/40 p-4">
                <p className="text-sm font-semibold text-foreground">{task.title}</p>
                <p className="mt-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">{task.priority} / {task.status.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Today</p>
          <div className="mt-4 space-y-3">
            {todaysEvents.map((event) => (
              <div key={event.id} className="rounded-xl bg-surface-variant/40 p-4">
                <p className="text-sm font-semibold text-foreground">{event.title}</p>
                <p className="mt-1 text-xs font-mono text-muted-foreground">
                  {new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date(event.start_at))}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
