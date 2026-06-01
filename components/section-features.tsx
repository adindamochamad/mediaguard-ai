const daftar_fitur = [
  {
    nomor: '01',
    judul: 'Traced to the source',
    deskripsi:
      'Every alert links directly to the Food and Drug Administration (FDA) page, PubMed study, or medical news article that triggered it. Verify it yourself in one click.',
  },
  {
    nomor: '02',
    judul: 'Only what matters to you',
    deskripsi:
      'Confidence scoring filters the noise. You see alerts relevant to your medications — not the 100,000 generic FDA communications clinicians ignore.',
  },
  {
    nomor: '03',
    judul: 'Your data stays yours',
    deskripsi:
      'Medication names are scoped to your account only. No data sharing, no profiles built for advertisers.',
  },
];

export function SectionFeatures() {
  return (
    <section id="features" className="section-kaca px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="label-section">Why MediGuard</p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl leading-tight text-foreground sm:text-4xl">
          Know what the FDA knows — filtered to your medications
        </h2>
        <div className="mt-14 divide-y divide-border border-y border-border">
          {daftar_fitur.map((fitur) => (
            <article key={fitur.judul} className="grid gap-4 py-8 sm:grid-cols-[4rem_1fr] sm:gap-8">
              <span className="text-sm font-semibold tabular-nums text-stone-400">{fitur.nomor}</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{fitur.judul}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{fitur.deskripsi}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
