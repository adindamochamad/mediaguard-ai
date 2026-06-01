import { notFound } from 'next/navigation';
import { buat_klien_supabase_admin } from '@/lib/supabase/admin';

type Alert = {
  id: string;
  severity: string;
  title: string;
  summary: string;
  source_url: string | null;
  created_at: string;
};

const warna_severity: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-900',
  info: 'bg-sky-100 text-sky-900',
};

function format_tanggal(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function nama_dari_email(email: string): string {
  const bagian = email.split('@')[0]?.trim() ?? '';
  return bagian.charAt(0).toUpperCase() + bagian.slice(1);
}

export default async function HalamanKaregiver({
  params,
}: {
  params: { token: string };
}) {
  const supabase = buat_klien_supabase_admin();

  const { data: akses, error: galat_akses } = await supabase
    .from('caregiver_access')
    .select('id, owner_id, caregiver_email, accepted_at')
    .eq('id', params.token)
    .maybeSingle();

  if (galat_akses || !akses) {
    notFound();
  }

  if (!akses.accepted_at) {
    await supabase
      .from('caregiver_access')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', params.token);
  }

  const { data: pengguna_auth } = await supabase.auth.admin.getUserById(akses.owner_id);
  const email_pemilik = pengguna_auth?.user?.email ?? '';
  const nama_pemilik = nama_dari_email(email_pemilik);

  const { data: alerts } = await supabase
    .from('alerts')
    .select('id, severity, title, summary, source_url, created_at')
    .eq('user_id', akses.owner_id)
    .order('created_at', { ascending: false })
    .limit(20);

  const daftar_alert = (alerts ?? []) as Alert[];

  return (
    <div className="min-h-screen">
      <header className="header-kaca px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-base font-semibold text-foreground">MediGuard AI</span>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            Caregiver view — read only
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-foreground">
          {nama_pemilik}&apos;s medication alerts
        </h1>
        <p className="mt-1 text-sm text-muted">
          Shared with you by {email_pemilik}. You have read-only access — you cannot make changes.
        </p>

        <div className="mt-8">
          {daftar_alert.length === 0 ? (
            <div className="card-surface p-10 text-center">
              <p className="text-sm text-muted">No alerts yet. Check back after a medication scan.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {daftar_alert.map((alert) => (
                <li
                  key={alert.id}
                  className="card-surface border-l-[3px] border-l-teal-500 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${warna_severity[alert.severity] ?? 'bg-slate-100 text-slate-800'}`}
                    >
                      {alert.severity}
                    </span>
                    <time className="text-xs text-muted">{format_tanggal(alert.created_at)}</time>
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-foreground">{alert.title}</h2>
                  <p className="mt-2 text-sm text-muted">{alert.summary}</p>
                  {alert.source_url ? (
                    <a
                      href={alert.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                    >
                      Open source
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-10 text-center text-xs text-muted">
          MediGuard AI is not a substitute for professional medical advice. Always consult a doctor
          or pharmacist for clinical decisions.
        </p>
      </main>
    </div>
  );
}
