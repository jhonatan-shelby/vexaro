'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getCashFlowData,
  getProductivityMetrics,
  getHabitConsistencyData,
  analyzeHabitDays,
  getBudgetCompliance,
  getSavingsData,
  type ReportPeriod,
  type CashFlowData,
  type ProductivityData,
  type HabitConsistencyData,
  type HabitDayAnalysis,
  type BudgetComplianceData,
  type SavingsData,
} from '../services/reports.service';
import { PeriodSelector } from './PeriodSelector';
import { CashFlowChart } from './CashFlowChart';
import { ProductivityMetrics } from './ProductivityMetrics';
import { HabitsHeatmap } from './HabitsHeatmap';
import { BudgetComplianceChart } from './BudgetComplianceChart';
import { SavingsOverview } from './SavingsOverview';

export function ReportsDashboard() {
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const [cashFlow, setCashFlow] = useState<CashFlowData[]>([]);
  const [productivity, setProductivity] = useState<ProductivityData | null>(null);
  const [habits, setHabits] = useState<HabitConsistencyData[]>([]);
  const [habitAnalysis, setHabitAnalysis] = useState<HabitDayAnalysis | null>(null);
  const [budgetCompliance, setBudgetCompliance] = useState<BudgetComplianceData[]>([]);
  const [savings, setSavings] = useState<SavingsData | null>(null);

  const loadData = useCallback(async () => {
    const [cf, prod, hab, bc, sav] = await Promise.all([
      getCashFlowData(period),
      getProductivityMetrics(period),
      getHabitConsistencyData(period),
      getBudgetCompliance(),
      getSavingsData(period),
    ]);
    setCashFlow(cf);
    setProductivity(prod);
    setHabits(hab);
    setHabitAnalysis(analyzeHabitDays(hab));
    setBudgetCompliance(bc);
    setSavings(sav);
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Comprehensive performance insights across productivity, habits, and finances.
          </p>
        </div>
        <PeriodSelector selected={period} onChange={setPeriod} />
      </div>

      {/* Section: Productivity KPIs */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Productivity</h2>
        {productivity && <ProductivityMetrics data={productivity} />}
      </section>

      {/* Section: Financial Analytics */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Financial Analytics</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CashFlowChart data={cashFlow} />
          </div>
          <div>
            {savings && <SavingsOverview data={savings} />}
          </div>
        </div>
      </section>

      {/* Section: Budget Compliance */}
      <section>
        <BudgetComplianceChart data={budgetCompliance} />
      </section>

      {/* Section: Habit Analytics */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Habit Analytics</h2>
        <HabitsHeatmap data={habits} analysis={habitAnalysis} />
      </section>
    </div>
  );
}
