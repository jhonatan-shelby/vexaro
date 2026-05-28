import { offlineDB, enqueueOperation, getCurrentUserId } from '@/modules/sync';
import type { Goal } from '../types';

const now = () => new Date().toISOString();

export async function listGoals(): Promise<Goal[]> {
  const userId = await getCurrentUserId();
  return offlineDB.goals.where('user_id').equals(userId).toArray();
}

export async function createGoal(type: 'financial' | 'productivity', title: string, target_value: number, due_date: string): Promise<Goal> {
  const timestamp = now();
  const goal: Goal = {
    id: crypto.randomUUID(),
    user_id: await getCurrentUserId(),
    type,
    title,
    target_value,
    current_value: 0,
    due_date,
    created_at: timestamp,
    updated_at: timestamp,
  };

  await offlineDB.goals.put(goal);
  await enqueueOperation('goals', 'insert', goal.id, goal);
  return goal;
}

export async function updateGoalProgress(goal_id: string, new_value: number): Promise<void> {
  const goal = await offlineDB.goals.get(goal_id);
  if (!goal) return;

  const updated: Goal = {
    ...goal,
    current_value: new_value,
    updated_at: now(),
  };

  await offlineDB.goals.put(updated);
  await enqueueOperation('goals', 'update', goal.id, updated);
}

export function calculateGoalStatus(goal: Goal): { progressPercentage: number; remainingDailyTarget: number; isDelayed: boolean } {
  const progressPercentage = Math.min((goal.current_value / goal.target_value) * 100, 100);
  
  const due = new Date(goal.due_date);
  const today = new Date();
  
  const remainingValue = Math.max(goal.target_value - goal.current_value, 0);
  let remainingDays = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  
  if (remainingDays <= 0) remainingDays = 1; // avoid division by zero
  
  const remainingDailyTarget = remainingValue / remainingDays;
  
  // Calculate if delayed:
  // Expected progress based on time elapsed vs actual progress
  const start = new Date(goal.created_at);
  const totalDays = Math.ceil((due.getTime() - start.getTime()) / 86400000) || 1;
  const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / 86400000);
  
  const expectedPercentage = Math.min((elapsedDays / totalDays) * 100, 100);
  const isDelayed = progressPercentage < expectedPercentage - 5; // 5% tolerance

  return { progressPercentage, remainingDailyTarget, isDelayed };
}
