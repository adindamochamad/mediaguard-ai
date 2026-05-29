type KartuMockup = {
  severity: 'critical' | 'warning' | 'info';
  judul: string;
  ringkasan: string;
  sumber: string;
};

const KARTU: KartuMockup[] = [
  {
    severity: 'critical',
    judul: 'FDA Safety Alert: Warfarin — Increased Bleeding Risk with NSAIDs',
    ringkasan:
      'The FDA has updated safety labeling for Warfarin to strengthen warnings about concurrent use with ibuprofen or naproxen.',
    sumber: 'fda.gov · detected 4 hours ago',
  },
  {
    severity: 'warning',
    judul: 'PubMed Study: Metformin — Vitamin B12 Deficiency Risk',
    ringkasan:
      'A 2024 meta-analysis confirms long-term Metformin use is associated with a 20–30% increased risk of B12 deficiency.',
    sumber: 'pubmed.ncbi.nlm.nih.gov · detected today',
  },
  {
    severity: 'info',
    judul: 'DailyMed: Lisinopril — Dry Cough Reporting Guidance Updated',
    ringkasan:
      'Prescribing information clarified: persistent dry cough affects ~10–15% of patients and resolves on discontinuation.',
    sumber: 'dailymed.nlm.nih.gov · detected today',
  },
];

const WARNA: Record<KartuMockup['severity'], string> = {
  critical: 'bg-red-100 text-red-800',
  warning:  'bg-amber-100 text-amber-900',
  info:     'bg-sky-100 text-sky-900',
};

const FITUR = [
  {
    ikon: '⚡',
    judul: 'Real-time, not cached',
    deskripsi:
      'Nimble crawls FDA.gov, PubMed, and DailyMed on demand — not from a database updated months ago.',
  },
  {
    ikon: '◎',
    judul: 'Matched to your list',
    deskripsi:
      'Claude AI reads the crawled content and filters to only the alerts relevant to your specific medications.',
  },
  {
    ikon: '→',
    judul: 'In your browser instantly',
    deskripsi:
      'Supabase Realtime pushes alerts the moment the scan completes — no refresh needed.',
  },
];

export function SectionRoadmap() {
  return (
    <section id="preview" className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left — callouts */}
          <div className="lg:pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
              See it in action
            </h2>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              From scan to alert in under 60 seconds
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Add your medications once. Click Scan. MediGuard does the rest — crawling live sources,
              scoring relevance with AI, and delivering plain-language alerts with primary source
              links.
            </p>

            <ul className="mt-8 space-y-6">
              {FITUR.map((f) => (
                <li key={f.judul} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-base text-accent">
                    {f.ikon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.judul}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{f.deskripsi}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — browser mockup */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">

            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-slate-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden />
              <div className="ml-3 flex-1 rounded-md border border-border bg-white px-3 py-1 text-xs text-muted">
                mediguard.ai/dashboard
              </div>
            </div>

            {/* Dashboard header */}
            <div className="flex items-center justify-between border-b border-border bg-background px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Alerts</p>
                <p className="text-xs text-muted">3 medications monitored</p>
              </div>
              <div className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white">
                Scan now
              </div>
            </div>

            {/* Alert cards */}
            <ul className="divide-y divide-border">
              {KARTU.map((kartu) => (
                <li key={kartu.judul} className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${WARNA[kartu.severity]}`}
                    >
                      {kartu.severity}
                    </span>
                    <span className="text-[10px] text-muted">{kartu.sumber}</span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold leading-snug text-foreground line-clamp-2">
                    {kartu.judul}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted line-clamp-2">
                    {kartu.ringkasan}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded border border-border px-2 py-0.5 text-[10px] text-foreground">
                      View details
                    </span>
                    {kartu.severity !== 'info' ? (
                      <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
                        Mark as read
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
