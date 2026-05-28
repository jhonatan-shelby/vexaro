'use client';

import { PiggyBank, TrendingUp, TrendingDown } from 'lucide-react';
import type { SavingsData } from '../services/reports.service';

interface SavingsOverviewProps {
  data: SavingsData;
}

export function SavingsOverview({ data }: SavingsOverviewProps) {
  const isPositive = data.savingsRate >= 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">Savings Overview</h3>

      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          <PiggyBank className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Savings Rate</p>
          <p className={`text-3xl font-bold font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {data.savingsRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-xl bg-surface-variant/40 p-3">
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium mb-1">
            <TrendingUp className="w-3 h-3" /> Income
          </div>
          <p className="text-lg font-bold font-mono">${data.totalIncome.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-surface-variant/40 p-3">
          <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium mb-1">
            <TrendingDown className="w-3 h-3" /> Expenses
          </div>
          <p className="text-lg font-bold font-mono">${data.totalExpense.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
