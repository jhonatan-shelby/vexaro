'use client';

import { useEffect, useState } from 'react';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { listGoals, calculateGoalStatus } from '../services/goals.service';
import type { Goal } from '../types';

export function GoalsDashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    listGoals().then(setGoals);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Goals</h1>
        <p className="text-muted-foreground mt-1 text-sm">Dynamic recalculation engine for your objectives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
            No goals set. Define your financial and productivity targets!
          </div>
        ) : (
          goals.map((goal) => {
            const { progressPercentage, remainingDailyTarget, isDelayed } = calculateGoalStatus(goal);
            return (
              <div key={goal.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-xl">{goal.title}</h3>
                    {isDelayed ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" /> Delayed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3" /> On Track
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{goal.current_value.toFixed(1)} / {goal.target_value.toFixed(1)}</span>
                  </div>
                  <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full transition-all ${isDelayed ? 'bg-orange-500' : 'bg-primary'}`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="bg-surface-variant/40 rounded-xl p-4 mt-4">
                  <p className="text-sm font-medium text-foreground mb-1">Dynamic Engine Insights:</p>
                  <p className="text-xs text-muted-foreground">
                    To reach your target by <span className="font-bold text-foreground">{new Date(goal.due_date).toLocaleDateString()}</span>, you need to average:
                  </p>
                  <p className="text-lg font-mono font-bold text-primary mt-1">
                    +{remainingDailyTarget.toFixed(2)} / day
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
