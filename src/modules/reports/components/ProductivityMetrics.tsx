'use client';

import { CheckCircle2, Clock, ListChecks, AlertTriangle, Timer, TrendingDown } from 'lucide-react';
import type { ProductivityData } from '../services/reports.service';

interface ProductivityMetricsProps {
  data: ProductivityData;
}

export function ProductivityMetrics({ data }: ProductivityMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ListChecks className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Total Tasks</p>
          <h4 className="text-2xl font-bold">{data.totalTasks}</h4>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Completed</p>
          <h4 className="text-2xl font-bold">{data.completedTasks}</h4>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Completion Rate</p>
          <h4 className="text-2xl font-bold">{data.completionRate}%</h4>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Overdue</p>
          <h4 className="text-2xl font-bold">{data.overdueTasks}</h4>
          <p className="text-[10px] text-muted-foreground">{data.overdueRate}% rate</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
          <Timer className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Avg. Lifecycle</p>
          <h4 className="text-2xl font-bold">{data.avgLifecycleDays}</h4>
          <p className="text-[10px] text-muted-foreground">days</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <TrendingDown className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Overdue Rate</p>
          <h4 className="text-2xl font-bold">{data.overdueRate}%</h4>
        </div>
      </div>
    </div>
  );
}
