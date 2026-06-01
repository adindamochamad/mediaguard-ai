'use client';

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type AlertRingkas = {
  severity: string;
};

const WARNA: Record<string, string> = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#38bdf8',
};

export function GrafikSeverityAlert({ alerts }: { alerts: AlertRingkas[] }) {
  const hitungan = alerts.reduce<Record<string, number>>(
    (acc, a) => { acc[a.severity] = (acc[a.severity] ?? 0) + 1; return acc; },
    { critical: 0, warning: 0, info: 0 },
  );

  const data = [
    { name: 'Critical', jumlah: hitungan.critical, severity: 'critical' },
    { name: 'Warning',  jumlah: hitungan.warning,  severity: 'warning'  },
    { name: 'Info',     jumlah: hitungan.info,      severity: 'info'     },
  ];

  if (alerts.length === 0) return null;

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Alert Breakdown</h2>
        <span className="text-xs text-muted">{alerts.length} total</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={data} barCategoryGap="35%">
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide allowDecimals={false} />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              formatter={(value) => [value, 'alerts']}
            />
            <Bar dataKey="jumlah" radius={[5, 5, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.severity} fill={WARNA[entry.severity] ?? '#94a3b8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex shrink-0 flex-col gap-2.5 pr-2">
          {data.map((entry) => (
            <div key={entry.severity} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: WARNA[entry.severity] ?? '#94a3b8' }} />
              <span className="text-xs text-muted">{entry.name}</span>
              <span className="w-4 text-right text-xs font-semibold tabular-nums text-foreground">{entry.jumlah}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
