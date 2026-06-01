type AlertStat = {
  severity: string;
  read_at: string | null;
};

type StatCardProps = {
  label: string;
  value: number;
  warna?: 'red' | 'amber' | 'accent' | 'slate';
};

function StatCard({ label, value, warna = 'slate' }: StatCardProps) {
  const warna_nilai: Record<string, string> = {
    red: 'text-red-700',
    amber: 'text-amber-700',
    accent: 'text-accent',
    slate: 'text-foreground',
  };

  return (
    <div className="card-surface px-4 py-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${warna_nilai[warna]}`}>{value}</p>
    </div>
  );
}

export function RingkasanAlert({ alerts }: { alerts: AlertStat[] }) {
  if (alerts.length === 0) return null;

  const critical = alerts.filter((a) => a.severity === 'critical').length;
  const warning = alerts.filter((a) => a.severity === 'warning').length;
  const unread = alerts.filter((a) => !a.read_at).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Total alerts" value={alerts.length} warna="slate" />
      <StatCard label="Critical" value={critical} warna="red" />
      <StatCard label="Warning" value={warning} warna="amber" />
      <StatCard label="Unread" value={unread} warna="accent" />
    </div>
  );
}
