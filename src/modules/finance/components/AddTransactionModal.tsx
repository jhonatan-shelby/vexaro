'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createTransaction } from '../services/finance.service';
import type { Category, TransactionType } from '../types';

interface AddTransactionModalProps {
  categories: Category[];
  onClose: () => void;
  onAdded: () => void;
}

export function AddTransactionModal({ categories, onClose, onAdded }: AddTransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    setIsSubmitting(true);
    try {
      await createTransaction(
        Number(amount),
        type,
        categoryId || null,
        new Date(date).toISOString(),
        notes || null
      );
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">New Transaction</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-surface-variant">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 font-medium transition-colors hover:bg-surface-variant has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="sr-only" />
              Expense
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 font-medium transition-colors hover:bg-surface-variant has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="sr-only" />
              Income
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Amount</label>
            <input type="number" step="0.01" min="0" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-border bg-background p-3 text-lg focus:border-primary focus:outline-none" placeholder="0.00" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-border bg-background p-3 focus:border-primary focus:outline-none">
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Date</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-border bg-background p-3 focus:border-primary focus:outline-none" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-border bg-background p-3 focus:border-primary focus:outline-none" placeholder="Optional notes..." />
          </div>

          <button type="submit" disabled={isSubmitting} className="mt-4 w-full rounded-xl bg-primary p-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70">
            {isSubmitting ? 'Saving...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
