import { supabase } from '@/lib/supabase/client';
import { offlineDB } from './offline.db';
import type { PendingOperation, SyncSummary, SyncTable } from '../types';

export function latestWriteWins(localUpdatedAt: string, remoteUpdatedAt: string | null): boolean {
  if (!remoteUpdatedAt) {
    return true;
  }

  return new Date(localUpdatedAt).getTime() >= new Date(remoteUpdatedAt).getTime();
}

export async function enqueueOperation(
  table: SyncTable,
  operation: PendingOperation['operation'],
  recordId: string,
  payload: object
): Promise<void> {
  await offlineDB.pendingOps.add({
    table,
    operation,
    payload,
    record_id: recordId,
    created_at: new Date().toISOString(),
  });
}

export async function getSyncSummary(): Promise<SyncSummary> {
  return {
    pendingCount: await offlineDB.pendingOps.count(),
  };
}

export async function replayPendingOperations(): Promise<SyncSummary> {
  const operations = await offlineDB.pendingOps.orderBy('created_at').toArray();

  for (const operation of operations) {
    const response = operation.operation === 'delete'
      ? await supabase.from(operation.table).delete().eq('id', operation.record_id)
      : await supabase.from(operation.table).upsert(operation.payload);

    if (response.error) {
      break;
    }

    if (operation.id !== undefined) {
      await offlineDB.pendingOps.delete(operation.id);
    }
  }

  return {
    pendingCount: await offlineDB.pendingOps.count(),
    lastReplayAt: new Date().toISOString(),
  };
}
