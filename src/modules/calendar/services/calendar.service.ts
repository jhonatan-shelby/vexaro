import { offlineDB, enqueueOperation, getCurrentUserId } from '@/modules/sync';
import type { CalendarEvent } from '../types';

const now = () => new Date().toISOString();

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 3600000);
}

export async function listCalendarEvents(): Promise<CalendarEvent[]> {
  const userId = await getCurrentUserId();
  const existing = await offlineDB.calendar_events.where('user_id').equals(userId).toArray();

  if (existing.length > 0) {
    return existing.sort((a, b) => a.start_at.localeCompare(b.start_at));
  }

  const base = new Date();
  base.setMinutes(0, 0, 0);

  const seeded: CalendarEvent[] = [
    {
      id: crypto.randomUUID(),
      user_id: userId,
      title: 'Daily planning review',
      description: 'Confirm priorities and calendar pressure.',
      start_at: addHours(base, 1).toISOString(),
      end_at: addHours(base, 1.5).toISOString(),
      type: 'meeting',
      source: 'manual',
      meeting_link: 'https://meet.google.com/',
      task_id: null,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: crypto.randomUUID(),
      user_id: userId,
      title: 'Focus block',
      description: 'Reserved from task board.',
      start_at: addHours(base, 3).toISOString(),
      end_at: addHours(base, 4).toISOString(),
      type: 'time_block',
      source: 'task',
      meeting_link: null,
      task_id: null,
      created_at: now(),
      updated_at: now(),
    },
  ];

  await offlineDB.calendar_events.bulkPut(seeded);
  return seeded;
}

export async function createManualEvent(title: string, startAt: string, endAt: string): Promise<CalendarEvent> {
  const timestamp = now();
  const event: CalendarEvent = {
    id: crypto.randomUUID(),
    user_id: await getCurrentUserId(),
    title,
    description: null,
    start_at: startAt,
    end_at: endAt,
    type: 'meeting',
    source: 'manual',
    meeting_link: null,
    task_id: null,
    created_at: timestamp,
    updated_at: timestamp,
  };

  await offlineDB.calendar_events.put(event);
  await enqueueOperation('calendar_events', 'insert', event.id, event);
  return event;
}
