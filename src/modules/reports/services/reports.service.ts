import { offlineDB, getCurrentUserId } from '@/modules/sync';

// ─── Period Filter Types ────────────────────────────────────────────────────
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'annual';

export interface CashFlowData {
  date: string;
  income: number;
  expense: number;
}

export interface ProductivityData {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  overdueRate: number;
  avgLifecycleDays: number;
}

export interface HabitConsistencyData {
  date: string;
  score: number;
  dayOfWeek: number; // 0=Sunday … 6=Saturday
}

export interface HabitDayAnalysis {
  bestDay: string;
  bestDayAvg: number;
  worstDay: string;
  worstDayAvg: number;
}

export interface BudgetComplianceData {
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  compliancePercentage: number;
}

export interface SavingsData {
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
}

// ─── Utility: Date Range from Period ────────────────────────────────────────
function getDateRange(period: ReportPeriod): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  let start: Date;

  switch (period) {
    case 'daily':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly':
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      break;
    case 'monthly':
      start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      break;
    case 'annual':
      start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return { start, end };
}

// ─── Cash Flow ──────────────────────────────────────────────────────────────
export async function getCashFlowData(period: ReportPeriod = 'monthly'): Promise<CashFlowData[]> {
  const userId = await getCurrentUserId();
  const { start, end } = getDateRange(period);
  const transactions = await offlineDB.transactions.where('user_id').equals(userId).toArray();

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  const dailyFlow: Record<string, { income: number; expense: number }> = {};

  filtered.forEach((t) => {
    const day = t.date.slice(0, 10);
    if (!dailyFlow[day]) {
      dailyFlow[day] = { income: 0, expense: 0 };
    }
    const entry = dailyFlow[day]!;
    if (t.type === 'income') entry.income += t.amount;
    else entry.expense += t.amount;
  });

  return Object.entries(dailyFlow)
    .map(([date, flow]) => ({ date, ...flow }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Productivity (Advanced) ────────────────────────────────────────────────
export async function getProductivityMetrics(period: ReportPeriod = 'monthly'): Promise<ProductivityData> {
  const userId = await getCurrentUserId();
  const { start, end } = getDateRange(period);
  const tasks = await offlineDB.tasks.where('user_id').equals(userId).toArray();

  const filtered = tasks.filter((t) => {
    const d = new Date(t.created_at);
    return d >= start && d <= end;
  });

  const totalTasks = filtered.length;
  const completedTasks = filtered.filter((t) => t.status === 'done').length;
  const now = new Date();
  const overdueTasks = filtered.filter(
    (t) => t.due_date && new Date(t.due_date) < now && t.status !== 'done'
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueRate = totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0;

  // Average lifecycle in days (created → updated when status=done)
  const completed = filtered.filter((t) => t.status === 'done');
  let avgLifecycleDays = 0;
  if (completed.length > 0) {
    const totalDays = completed.reduce((sum, t) => {
      const created = new Date(t.created_at).getTime();
      const updated = new Date(t.updated_at).getTime();
      return sum + (updated - created) / 86_400_000;
    }, 0);
    avgLifecycleDays = Math.round((totalDays / completed.length) * 10) / 10;
  }

  return { totalTasks, completedTasks, overdueTasks, completionRate, overdueRate, avgLifecycleDays };
}

// ─── Habits Consistency ─────────────────────────────────────────────────────
export async function getHabitConsistencyData(period: ReportPeriod = 'monthly'): Promise<HabitConsistencyData[]> {
  const userId = await getCurrentUserId();
  const { start, end } = getDateRange(period);
  const logs = await offlineDB.habit_logs.where('user_id').equals(userId).toArray();

  const filtered = logs.filter((l) => {
    const d = new Date(l.completed_at);
    return d >= start && d <= end;
  });

  const dailyLogs: Record<string, number> = {};
  filtered.forEach((log) => {
    const day = log.completed_at.slice(0, 10);
    dailyLogs[day] = (dailyLogs[day] || 0) + 1;
  });

  return Object.entries(dailyLogs)
    .map(([date, score]) => ({
      date,
      score,
      dayOfWeek: new Date(date).getDay(),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Habits: Best/Worst Day Analysis ────────────────────────────────────────
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function analyzeHabitDays(data: HabitConsistencyData[]): HabitDayAnalysis | null {
  if (data.length === 0) return null;

  const dayTotals: Record<number, number[]> = {};
  data.forEach((d) => {
    if (!dayTotals[d.dayOfWeek]) dayTotals[d.dayOfWeek] = [];
    dayTotals[d.dayOfWeek]!.push(d.score);
  });

  const dayAverages = Object.entries(dayTotals).map(([day, scores]) => ({
    day: Number(day),
    avg: scores.reduce((a, b) => a + b, 0) / scores.length,
  }));

  dayAverages.sort((a, b) => b.avg - a.avg);

  const best = dayAverages[0];
  const worst = dayAverages[dayAverages.length - 1];
  if (!best || !worst) return null;

  return {
    bestDay: DAY_NAMES[best.day] ?? 'Unknown',
    bestDayAvg: Math.round(best.avg * 10) / 10,
    worstDay: DAY_NAMES[worst.day] ?? 'Unknown',
    worstDayAvg: Math.round(worst.avg * 10) / 10,
  };
}

// ─── Budget Compliance ──────────────────────────────────────────────────────
export async function getBudgetCompliance(): Promise<BudgetComplianceData[]> {
  const userId = await getCurrentUserId();
  const budgets = await offlineDB.budgets.where('user_id').equals(userId).toArray();
  const categories = await offlineDB.categories.where('user_id').equals(userId).toArray();
  const transactions = await offlineDB.transactions.where('user_id').equals(userId).toArray();

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  return budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.category_id === budget.category_id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const compliancePercentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;

    return {
      categoryName: catMap.get(budget.category_id) ?? 'Unknown',
      budgetAmount: budget.amount,
      spentAmount: spent,
      compliancePercentage,
    };
  });
}

// ─── Savings Rate ───────────────────────────────────────────────────────────
export async function getSavingsData(period: ReportPeriod = 'monthly'): Promise<SavingsData> {
  const userId = await getCurrentUserId();
  const { start, end } = getDateRange(period);
  const transactions = await offlineDB.transactions.where('user_id').equals(userId).toArray();

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return { totalIncome, totalExpense, savingsRate };
}
