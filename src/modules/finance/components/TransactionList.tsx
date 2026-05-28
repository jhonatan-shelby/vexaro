'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { Transaction, Category } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const getCategory = (id: string | null) => categories.find((c) => c.id === id);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions found.</p>
        ) : (
          transactions.slice(0, 10).map((t) => {
            const isIncome = t.type === 'income';
            const cat = getCategory(t.category_id);
            return (
              <div key={t.id} className="flex items-center justify-between rounded-xl bg-surface-variant/40 p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isIncome ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.notes || (isIncome ? 'Income' : 'Expense')}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(t.date).toLocaleDateString()}</span>
                      {cat && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            {cat.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`font-mono font-semibold ${isIncome ? 'text-green-500' : 'text-foreground'}`}>
                  {isIncome ? '+' : '-'}${t.amount.toFixed(2)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
