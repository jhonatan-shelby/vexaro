'use client';

import type { Budget, Category, Transaction } from '../types';

interface BudgetOverviewProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
}

export function BudgetOverview({ budgets, categories, transactions }: BudgetOverviewProps) {
  const getCategory = (id: string) => categories.find((c) => c.id === id);

  const getSpent = (categoryId: string) => {
    return transactions
      .filter((t) => t.category_id === categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Budget Overview</h2>
      <div className="space-y-6">
        {budgets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No budgets configured.</p>
        ) : (
          budgets.map((budget) => {
            const cat = getCategory(budget.category_id);
            const spent = getSpent(budget.category_id);
            const percentage = Math.min((spent / budget.amount) * 100, 100);
            const isOver = spent > budget.amount;

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {cat && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />}
                    {cat ? cat.name : 'Unknown Category'}
                  </span>
                  <span className="font-mono">
                    ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <div
                    className={`h-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-primary'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {isOver && (
                  <p className="text-xs text-red-500 font-medium text-right">Budget exceeded</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
