import { offlineDB, enqueueOperation, getCurrentUserId } from '@/modules/sync';
import type { Category, Transaction, Budget, TransactionType } from '../types';

const now = () => new Date().toISOString();

// CATEGORIES
export async function listCategories(): Promise<Category[]> {
  const userId = await getCurrentUserId();
  const existing = await offlineDB.categories.where('user_id').equals(userId).toArray();

  if (existing.length > 0) {
    return existing;
  }

  // Optimistic seed for local DB; server trigger handles real DB on profile insert.
  const defaultCategories: Category[] = [
    { id: crypto.randomUUID(), user_id: userId, name: 'Ahorro', is_default: true, color: '#416900', created_at: now(), updated_at: now() },
    { id: crypto.randomUUID(), user_id: userId, name: 'Comida', is_default: true, color: '#EAB308', created_at: now(), updated_at: now() },
    { id: crypto.randomUUID(), user_id: userId, name: 'Alquiler', is_default: true, color: '#3B82F6', created_at: now(), updated_at: now() },
    { id: crypto.randomUUID(), user_id: userId, name: 'Salud', is_default: true, color: '#EF4444', created_at: now(), updated_at: now() },
    { id: crypto.randomUUID(), user_id: userId, name: 'Universidad', is_default: true, color: '#8B5CF6', created_at: now(), updated_at: now() },
  ];

  await offlineDB.categories.bulkPut(defaultCategories);
  return defaultCategories;
}

export async function createCategory(name: string, color: string): Promise<Category> {
  const category: Category = {
    id: crypto.randomUUID(),
    user_id: await getCurrentUserId(),
    name,
    is_default: false,
    color,
    created_at: now(),
    updated_at: now(),
  };

  await offlineDB.categories.put(category);
  await enqueueOperation('categories', 'insert', category.id, category);
  return category;
}

// TRANSACTIONS
export async function listTransactions(): Promise<Transaction[]> {
  const userId = await getCurrentUserId();
  return offlineDB.transactions.where('user_id').equals(userId).reverse().sortBy('date');
}

export async function createTransaction(amount: number, type: TransactionType, category_id: string | null, date: string, notes: string | null): Promise<Transaction> {
  const timestamp = now();
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    user_id: await getCurrentUserId(),
    amount,
    type,
    category_id,
    date,
    notes,
    created_at: timestamp,
    updated_at: timestamp,
  };

  await offlineDB.transactions.put(transaction);
  await enqueueOperation('transactions', 'insert', transaction.id, transaction);
  return transaction;
}

// BUDGETS
export async function listBudgets(): Promise<Budget[]> {
  const userId = await getCurrentUserId();
  return offlineDB.budgets.where('user_id').equals(userId).toArray();
}

export async function setBudget(category_id: string, amount: number, period_start: string, period_end: string): Promise<Budget> {
  const timestamp = now();
  const budget: Budget = {
    id: crypto.randomUUID(),
    user_id: await getCurrentUserId(),
    category_id,
    amount,
    period_start,
    period_end,
    created_at: timestamp,
    updated_at: timestamp,
  };

  await offlineDB.budgets.put(budget);
  await enqueueOperation('budgets', 'insert', budget.id, budget);
  return budget;
}
