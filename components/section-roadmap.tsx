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
    sumber: 'fda.gov · 4 hours ago',
  },
  {
    severity: 'critical',
    judul: 'FDA Black Box Warning: Sertraline — Suicidal Thoughts in Young Adults',
    ringkasan:
      'Antidepressants may increase suicidal thinking in patients aged 18–24 during the first 1–2 months of treatment.',
    sumber: 'fda.gov · 6 hours ago',
  },
  {
    severity: 'warning',
    judul: 'FDA Communication: Atorvastatin — Muscle Pain and Rhabdomyolysis Risk',
    ringkasan:
      'Patients on Atorvastatin 40–80mg have elevated risk of muscle injury with certain antibiotics or antifungals.',
    sumber: 'fda.gov · today',
  },
  {
    severity: 'warning',
    judul: 'PubMed Study: Metformin — Vitamin B12 Deficiency Risk',
    ringkasan:
      'Long-term Metformin use is associated with a 20–30% increased risk of B12 deficiency.',
    sumber: 'pubmed · today',
  },
];

const BORDER_SEVERITY: Record<KartuMockup['severity'], string> = {
  critical: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-sky-500',
};

const FITUR = [
  {
    judul: 'Real-time, not cached',
    deskripsi:
      'Nimble crawls FDA.gov, PubMed, and medical news on demand — not from a database updated months ago.',
  },
  {
    judul: 'Matched to your list',
    deskripsi:
      'Claude reads crawled content and filters to alerts relevant to your specific medications.',
  },
  {
    judul: 'In your browser instantly',
    deskripsi:
      'Supabase Realtime pushes alerts the moment the scan completes — no refresh needed.',
  },
];

export function SectionRoadmap() {
  return (
    <section id="preview" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pt-4">
            <p className="label-section">Preview</p>
            <h2 className="font-display mt-3 text-3xl leading-tight text-foreground sm:text-4xl">
              From scan to alert in under a minute
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Add your medications once. Click Scan. MediGuard crawls live sources, scores relevance,
              and delivers plain-language alerts with primary source links.
            </p>

            <ul className="mt-10 space-y-5">
              {FITUR.map((f, i) => (
                <li key={f.judul} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-stone-500">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.judul}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{f.deskripsi}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface overflow-hidden shadow-card">
            <div className="flex items-center gap-2 border-b border-border bg-stone-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" aria-hidden />
              <div className="ml-2 flex-1 rounded border border-border bg-white px-3 py-1 text-[11px] text-muted">
                mediguard.adindamochamad.com/dashboard
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Alerts</p>
                <p className="text-xs text-muted">9 medications monitored</p>
              </div>
              <span className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white">
                Scan now
              </span>
            </div>

            <ul className="divide-y divide-border">
              {KARTU.map((kartu) => (
                <li
                  key={kartu.judul}
                  className={`border-l-[3px] px-5 py-4 ${BORDER_SEVERITY[kartu.severity]}`}
                >
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                    {kartu.severity} · {kartu.sumber}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold leading-snug text-foreground line-clamp-2">
                    {kartu.judul}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted line-clamp-2">
                    {kartu.ringkasan}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
