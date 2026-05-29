import { TombolTandaiBaca } from '@/components/tombol-tandai-baca';
import { buat_klien_supabase_server } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

const WARNA_SEVERITY: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  warning:  'bg-amber-100 text-amber-900',
  info:     'bg-sky-100 text-sky-900',
};

const LABEL_SUMBER: Record<string, string> = {
  fda:    'Food and Drug Administration (FDA)',
  pubmed: 'PubMed / DailyMed',
};

function format_tanggal(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric',
  });
}

function alasan_severity(severity: string, confidence: number | null): string {
  const pct = confidence != null ? Math.round(confidence * 100) : null;
  const keterangan = pct != null ? ` (AI confidence: ${pct}%)` : '';

  if (severity === 'critical')
    return `Classified as Critical because the signal indicates a high-risk safety issue${keterangan}. We recommend contacting your healthcare provider before your next dose.`;
  if (severity === 'warning')
    return `Classified as Warning because the signal indicates a moderate risk worth discussing with your clinician${keterangan}.`;
  return `Classified as Info because this looks like a low-risk update worth monitoring${keterangan}.`;
}

function aksi_severity(severity: string): string[] {
  if (severity === 'critical')
    return [
      'Contact your doctor or pharmacist today — before making any medication changes.',
      'Bring your current medication list and this alert summary to the conversation.',
    ];
  if (severity === 'warning')
    return [
      'Discuss this update with your clinician at the next available visit.',
      'Continue your current prescription plan unless advised otherwise.',
    ];
  return [
    'Save this update for your next medication review.',
    'No immediate action needed — continue following your prescribed plan.',
  ];
}

export default async function HalamanDetailAlert({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await buat_klien_supabase_server();
  const {
    data: { user: pengguna },
  } = await supabase.auth.getUser();

  if (!pengguna) redirect('/login');

  const { data: alert } = await supabase
    .from('alerts')
    .select('id, user_id, severity, title, summary, source_url, source_type, ai_confidence, read_at, created_at')
    .eq('id', params.id)
    .eq('user_id', pengguna.id)
    .maybeSingle();

  if (!alert) notFound();

  const aksi = aksi_severity(alert.severity);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        ← Back to alerts
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${WARNA_SEVERITY[alert.severity] ?? 'bg-slate-100 text-slate-800'}`}
          >
            {alert.severity}
          </span>
          {alert.source_type ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
              {LABEL_SUMBER[alert.source_type] ?? alert.source_type}
            </span>
          ) : null}
          <time className="text-xs text-muted">
            Detected {format_tanggal(alert.created_at)}
          </time>
        </div>

        <h1 className="mt-3 text-xl font-semibold leading-snug text-foreground">
          {alert.title}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted whitespace-pre-line">
          {alert.summary}
        </p>

        {alert.source_url ? (
          <a
            href={alert.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            Open source ↗
          </a>
        ) : null}
      </div>

      {/* Severity rationale */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Why this severity?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          {alasan_severity(alert.severity, alert.ai_confidence)}
        </p>
      </div>

      {/* Action items */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Recommended actions
        </p>
        <ul className="mt-3 space-y-2">
          {aksi.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="mt-0.5 shrink-0 text-accent">›</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions footer */}
      <div className="flex flex-wrap items-center gap-3">
        <TombolTandaiBaca alert_id={alert.id} sudah_dibaca={!!alert.read_at} />
        <Link
          href="/dashboard/chat"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-slate-50"
        >
          Ask AI about this →
        </Link>
      </div>
    </div>
  );
}
