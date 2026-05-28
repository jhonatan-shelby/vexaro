import { DashboardShell } from '@/modules/dashboard';

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-semibold text-foreground">Daily Control</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">{today}</p>
      </div>
      <DashboardShell />
    </div>
  );
}
