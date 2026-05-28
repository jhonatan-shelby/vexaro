import { FinanceDashboard } from '@/modules/finance';

export const metadata = {
  title: 'Finance | Vexaro',
};

export default function FinancePage() {
  return (
    <div className="container mx-auto p-6 md:p-10 max-w-7xl">
      <FinanceDashboard />
    </div>
  );
}
