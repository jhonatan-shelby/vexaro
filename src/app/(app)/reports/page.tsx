import { ReportsDashboard } from '@/modules/reports';

export const metadata = {
  title: 'Reports & Analytics | Vexaro',
};

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-6 md:p-10 max-w-7xl">
      <ReportsDashboard />
    </div>
  );
}
