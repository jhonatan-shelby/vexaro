import { CalendarWorkspace } from '@/modules/calendar';

export default function CalendarPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-semibold text-foreground">Calendar</h1>
        <p className="text-muted-foreground text-sm mt-1">Month, week, day, meetings, and task blocks.</p>
      </div>
      <CalendarWorkspace />
    </div>
  );
}
