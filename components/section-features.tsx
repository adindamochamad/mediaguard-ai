const daftar_fitur = [
  {
    judul: 'Traced to the source',
    deskripsi:
      'Every alert links directly to the Food and Drug Administration (FDA) page, PubMed study, or DailyMed entry that triggered it. No black boxes — verify it yourself in one click.',
    ikon: '◈',
  },
  {
    judul: 'Only what matters to you',
    deskripsi:
      'AI confidence scoring filters the noise. You see alerts relevant to your specific medications — not the 100,000 generic Food and Drug Administration (FDA) communications your doctor ignores.',
    ikon: '◎',
  },
  {
    judul: 'Your data stays yours',
    deskripsi:
      'Medication names are scoped to your account only. No data sharing, no profiles built for advertisers — just the safety intelligence you signed up for.',
    ikon: '◇',
  },
];

export function SectionFeatures() {
  return (
    <section id="features" className="border-t border-border bg-card px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Why MediGuard</h2>
        <p className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-foreground">
          Know what the Food and Drug Administration (FDA) knows — personalized to your medications
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {daftar_fitur.map((fitur) => (
            <article
              key={fitur.judul}
              className="rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-soft"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-lg text-accent"
                aria-hidden
              >
                {fitur.ikon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{fitur.judul}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{fitur.deskripsi}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
