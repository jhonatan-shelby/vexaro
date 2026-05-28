import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  progress?: number; // 0-100 for optional progress bar
}

export function KpiCard({ label, value, subtext, icon: Icon, trend = 'neutral', progress }: KpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">{label}</p>
        <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
      </div>

      {/* Main value */}
      <p className="font-heading text-3xl font-semibold text-foreground tracking-tight">{value}</p>

      {/* Sub-info */}
      <div className="flex items-center gap-1.5">
        {trend === 'up' && (
          <span className="text-secondary text-xs font-mono">↑</span>
        )}
        {trend === 'down' && (
          <span className="text-destructive text-xs font-mono">↓</span>
        )}
        <span className={cn(
          'text-xs font-mono',
          trend === 'up' ? 'text-secondary' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
        )}>
          {subtext}
        </span>
      </div>

      {/* Optional progress bar */}
      {progress !== undefined && (
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
