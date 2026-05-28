'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { BudgetComplianceData } from '../services/reports.service';

interface BudgetComplianceChartProps {
  data: BudgetComplianceData[];
}

export function BudgetComplianceChart({ data }: BudgetComplianceChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Budget Compliance</h3>
        <p className="text-sm text-muted-foreground">No budgets configured yet.</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.categoryName,
    spent: d.spentAmount,
    budget: d.budgetAmount,
    percentage: d.compliancePercentage,
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">Budget Compliance by Category</h3>
      <p className="mb-6 text-xs text-muted-foreground">Spent vs. allocated budget per category</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#888888" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#888888" tickLine={false} axisLine={false} width={80} />
            <Tooltip
              contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === 'spent' ? 'Spent' : 'Budget']}
            />
            <Bar dataKey="budget" fill="#E5E7EB" radius={[0, 4, 4, 0]} />
            <Bar dataKey="spent" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.percentage > 100 ? '#EF4444' : entry.percentage > 80 ? '#F59E0B' : '#416900'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
