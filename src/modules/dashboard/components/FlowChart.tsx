'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: 'Oct 1',  finance: 3200, productivity: 4100 },
  { date: 'Oct 8',  finance: 3800, productivity: 4500 },
  { date: 'Oct 15', finance: 5200, productivity: 5000 },
  { date: 'Oct 22', finance: 6800, productivity: 6500 },
  { date: 'Oct 29', finance: 8100, productivity: 8700 },
];

export function FlowChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#416900" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#416900" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#accfb3" stopOpacity={0.08} />
            <stop offset="95%" stopColor="#accfb3" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#e6e8ea" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#727972', fontFamily: 'var(--font-jetbrains)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #e6e8ea',
            borderRadius: 8,
            fontSize: 12,
            fontFamily: 'var(--font-jetbrains)',
          }}
          labelStyle={{ color: '#191c1e', fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="finance"
          stroke="#416900"
          strokeWidth={2}
          fill="url(#colorFinance)"
          name="Financial Flow"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="productivity"
          stroke="#accfb3"
          strokeWidth={2}
          fill="url(#colorProd)"
          name="Productivity"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
