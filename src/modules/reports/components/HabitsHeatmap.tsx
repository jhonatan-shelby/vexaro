'use client';

import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import type { HabitConsistencyData, HabitDayAnalysis } from '../services/reports.service';

interface HabitsHeatmapProps {
  data: HabitConsistencyData[];
  analysis: HabitDayAnalysis | null;
}

export function HabitsHeatmap({ data, analysis }: HabitsHeatmapProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Habit Consistency</h3>
        <p className="text-sm text-muted-foreground">No habit logs available for this period.</p>
      </div>
    );
  }

  const maxScore = Math.max(...data.map((d) => d.score));

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Habit Consistency</h3>
        <p className="text-xs text-muted-foreground mt-1">Last {data.length} active days</p>
      </div>

      {/* Heatmap grid */}
      <div className="flex flex-wrap gap-1.5">
        {data.slice(-42).map((day) => {
          const ratio = maxScore > 0 ? day.score / maxScore : 0;
          const bg =
            ratio > 0.75
              ? 'bg-[#416900]'
              : ratio > 0.5
              ? 'bg-[#416900]/70'
              : ratio > 0.25
              ? 'bg-[#416900]/40'
              : 'bg-[#416900]/15';

          return (
            <div
              key={day.date}
              className={`w-6 h-6 rounded-[4px] ${bg} cursor-help transition-transform hover:scale-125`}
              title={`${day.date}: ${day.score} habit${day.score !== 1 ? 's' : ''} completed`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-[3px] bg-[#416900]/15" />
        <div className="w-3.5 h-3.5 rounded-[3px] bg-[#416900]/40" />
        <div className="w-3.5 h-3.5 rounded-[3px] bg-[#416900]/70" />
        <div className="w-3.5 h-3.5 rounded-[3px] bg-[#416900]" />
        <span>More</span>
      </div>

      {/* Best/Worst Day Analysis */}
      {analysis && (
        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" /> Day Analysis
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-3">
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium mb-1">
                <ArrowUp className="w-3 h-3" /> Best Day
              </div>
              <p className="text-sm font-bold">{analysis.bestDay}</p>
              <p className="text-[10px] text-muted-foreground">{analysis.bestDayAvg} avg habits/day</p>
            </div>
            <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3">
              <div className="flex items-center gap-1 text-xs text-red-500 font-medium mb-1">
                <ArrowDown className="w-3 h-3" /> Worst Day
              </div>
              <p className="text-sm font-bold">{analysis.worstDay}</p>
              <p className="text-[10px] text-muted-foreground">{analysis.worstDayAvg} avg habits/day</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
