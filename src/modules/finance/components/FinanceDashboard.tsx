'use client';

import { useEffect, useState } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { listCategories, listTransactions, listBudgets } from '../services/finance.service';
import type { Category, Transaction, Budget } from '../types';
import { TransactionList } from './TransactionList';
import { BudgetOverview } from './BudgetOverview';
import { AddTransactionModal } from './AddTransactionModal';
import { KpiCard } from '@/modules/dashboard/components/KpiCard';

export function FinanceDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const [cats, trans, buds] = await Promise.all([
      listCategories(),
      listTransactions(),
      listBudgets(),
    ]);
    setCategories(cats);
    setTransactions(trans);
    setBudgets(buds);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Finance</h1>
          <p className="text-muted-foreground mt-1 text-sm">Control your cash flow and budgets.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard label="Total Balance" value={`$${balance.toFixed(2)}`} subtext="All time" icon={Wallet} trend={balance >= 0 ? 'up' : 'down'} />
        <KpiCard label="Total Expenses" value={`$${totalExpense.toFixed(2)}`} subtext="All time" icon={TrendingDown} trend="down" />
        <KpiCard label="Savings Rate" value={`${savingsRate}%`} subtext="Income vs Expenses" icon={TrendingUp} trend={savingsRate > 20 ? 'up' : 'neutral'} progress={Math.max(0, savingsRate)} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TransactionList transactions={transactions} categories={categories} />
        </div>
        <div>
          <BudgetOverview budgets={budgets} transactions={transactions} categories={categories} />
        </div>
      </div>

      {isModalOpen && (
        <AddTransactionModal
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onAdded={loadData}
        />
      )}
    </div>
  );
}
