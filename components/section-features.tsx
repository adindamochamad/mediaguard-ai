const daftar_fitur = [
  {
    judul: 'Curated sources',
    deskripsi:
      'FDA, DailyMed, and PubMed citations — short excerpts and canonical URLs, not copied label walls.',
    ikon: '◈',
  },
  {
    judul: 'Signal over noise',
    deskripsi:
      'Confidence scoring and deduplication so duplicate sources do not flood your alert feed.',
    ikon: '◎',
  },
  {
    judul: 'Private by default',
    deskripsi:
      'Row-level security on Supabase keeps medication lists scoped to the signed-in user.',
    ikon: '◇',
  },
];

export function SectionFeatures() {
  return (
    <section id="features" className="border-t border-border bg-card px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Why MediGuard</h2>
        <p className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-foreground">
          Built for demos that judges can trust
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
