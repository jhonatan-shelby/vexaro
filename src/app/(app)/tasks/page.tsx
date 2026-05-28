import { TasksBoard } from '@/modules/tasks';

export default function TasksPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-semibold text-foreground">Task Board</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kanban, priority planning, offline capture, and time blocking.
        </p>
      </div>
      <TasksBoard />
    </div>
  );
}
