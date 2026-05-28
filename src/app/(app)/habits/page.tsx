import { HabitsDashboard } from '@/modules/habits';

export const metadata = {
  title: 'Habits | Vexaro',
};

export default function HabitsPage() {
  return (
    <div className="container mx-auto p-6 md:p-10 max-w-7xl">
      <HabitsDashboard />
    </div>
  );
}
