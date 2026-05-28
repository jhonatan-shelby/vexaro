import { GoalsDashboard } from '@/modules/goals';

export const metadata = {
  title: 'Goals | Vexaro',
};

export default function GoalsPage() {
  return (
    <div className="container mx-auto p-6 md:p-10 max-w-7xl">
      <GoalsDashboard />
    </div>
  );
}
