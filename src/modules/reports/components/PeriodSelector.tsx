'use client';

import type { ReportPeriod } from '../services/reports.service';

const PERIODS: { label: string; value: ReportPeriod }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' },
];

interface PeriodSelectorProps {
  selected: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
}

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            selected === p.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-surface-variant'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
