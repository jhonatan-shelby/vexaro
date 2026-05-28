'use client';

import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { DateClickArg } from '@fullcalendar/interaction';
import { CalendarPlus, Link2 } from 'lucide-react';
import { createManualEvent, listCalendarEvents } from '../services/calendar.service';
import type { CalendarEvent } from '../types';

interface FullCalendarEventInput {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
}

function formatTimeRange(event: CalendarEvent) {
  const formatter = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' });
  return `${formatter.format(new Date(event.start_at))} - ${formatter.format(new Date(event.end_at))}`;
}

export function CalendarWorkspace() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    listCalendarEvents().then(setEvents);
  }, []);

  const fullCalendarEvents = useMemo<FullCalendarEventInput[]>(
    () => events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start_at,
      end: event.end_at,
      backgroundColor: event.type === 'meeting' ? '#416900' : '#0F2E1B',
      borderColor: event.type === 'meeting' ? '#416900' : '#0F2E1B',
    })),
    [events]
  );

  const agenda = useMemo(
    () => events
      .filter((event) => event.start_at.slice(0, 10) === selectedDate)
      .sort((a, b) => a.start_at.localeCompare(b.start_at)),
    [events, selectedDate]
  );

  const refresh = async () => setEvents(await listCalendarEvents());

  const handleDateClick = async (arg: DateClickArg) => {
    const start = new Date(`${arg.dateStr}T09:00:00`);
    const end = new Date(start.getTime() + 30 * 60000);
    await createManualEvent(title.trim() || 'Manual meeting', start.toISOString(), end.toISOString());
    setSelectedDate(arg.dateStr);
    setTitle('');
    await refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Unified calendar</p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">Meetings, deadlines, and focus blocks</h2>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Event title"
              className="h-10 w-48 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-xs font-mono text-muted-foreground">
              <CalendarPlus className="h-4 w-4" />
              Click a day
            </span>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
          events={fullCalendarEvents}
          dateClick={handleDateClick}
          eventClick={(info) => setSelectedDate(info.event.start?.toISOString().slice(0, 10) ?? selectedDate)}
        />
      </section>

      <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Daily agenda</p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">
          {new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(new Date(`${selectedDate}T00:00:00`))}
        </h2>

        <div className="mt-4 space-y-3">
          {agenda.length === 0 && (
            <p className="rounded-xl bg-surface-variant/40 p-4 text-sm text-muted-foreground">No events planned for this day.</p>
          )}
          {agenda.map((event) => (
            <article key={event.id} className="rounded-xl border-l-4 border-l-secondary bg-surface-variant/40 p-4">
              <p className="text-xs font-mono font-semibold text-secondary">{formatTimeRange(event)}</p>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{event.title}</h3>
              {event.description && <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>}
              {event.meeting_link && (
                <a
                  href={event.meeting_link}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Link2 className="h-3 w-3" />
                  Join meeting
                </a>
              )}
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
