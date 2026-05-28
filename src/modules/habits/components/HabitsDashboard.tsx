'use client';

import { useEffect, useState } from 'react';
import { Plus, Check, Flame, Trophy } from 'lucide-react';
import { listHabits, logHabitCompletion, calculateStreak } from '../services/habits.service';
import type { Habit } from '../types';
import { KpiCard } from '@/modules/dashboard/components/KpiCard';

export function HabitsDashboard() {
  const [habits, setHabits] = useState<(Habit & { currentStreak: number; bestStreak: number })[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());

  const loadData = async () => {
    const rawHabits = await listHabits();
    const enriched = await Promise.all(
      rawHabits.map(async (h) => {
        const streaks = await calculateStreak(h.id);
        return { ...h, ...streaks };
      })
    );
    setHabits(enriched);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComplete = async (habitId: string) => {
    if (completedToday.has(habitId)) return;
    await logHabitCompletion(habitId);
    setCompletedToday((prev) => new Set(prev).add(habitId));
    loadData();
  };

  const totalCurrentStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Habits</h1>
        <p className="text-muted-foreground mt-1 text-sm">Build consistency and track your streaks.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <KpiCard label="Total Active Streaks" value={String(totalCurrentStreak)} subtext="Days" icon={Flame} trend="up" />
        <KpiCard label="Total Habits" value={String(habits.length)} subtext="Active trackers" icon={Trophy} trend="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {habits.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
            No habits yet. Start by creating one!
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted = completedToday.has(habit.id);
            return (
              <div key={habit.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <h3 className="font-semibold text-lg">{habit.name}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> {habit.currentStreak} day streak</span>
                    <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-500" /> Best: {habit.bestStreak}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleComplete(habit.id)}
                  disabled={isCompleted}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    isCompleted ? 'bg-primary text-primary-foreground opacity-50 cursor-not-allowed' : 'bg-surface-variant hover:bg-primary/20 text-foreground'
                  }`}
                >
                  <Check className="h-6 w-6" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
