import Link from 'next/link';

type Langkah = {
  nomor: string;
  judul: string;
  deskripsi: string;
  status: 'selesai' | 'aktif' | 'menunggu';
  href?: string;
  label_cta?: string;
};

const LANGKAH: Langkah[] = [
  {
    nomor: '1',
    judul: 'Create your account',
    deskripsi: "You're in. Account created and secured.",
    status: 'selesai',
  },
  {
    nomor: '2',
    judul: 'Add your medications',
    deskripsi:
      'Tell MediGuard which medications you take. We find FDA and PubMed updates specific to you — not generic alerts.',
    status: 'aktif',
    href: '/dashboard/medications',
    label_cta: 'Add medications',
  },
  {
    nomor: '3',
    judul: 'Run your first scan',
    deskripsi:
      'One click. MediGuard crawls FDA.gov, PubMed, and medical news and surfaces what matters to your list.',
    status: 'menunggu',
  },
];

export function PanelOnboarding() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="card-surface p-8">
        <h2 className="text-xl font-semibold text-foreground">Get your first alert in 2 steps</h2>
        <p className="mt-1 text-sm text-muted">MediGuard is ready. Just tell it what to watch for.</p>

        <ol className="mt-8 space-y-6">
          {LANGKAH.map((langkah) => (
            <li key={langkah.nomor} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    langkah.status === 'selesai'
                      ? 'bg-emerald-100 text-emerald-800'
                      : langkah.status === 'aktif'
                        ? 'bg-accent text-white'
                        : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {langkah.status === 'selesai' ? '✓' : langkah.nomor}
                </div>
                {langkah.nomor !== '3' ? <div className="mt-1 w-px flex-1 bg-border" /> : null}
              </div>

              <div className="pb-6">
                <p
                  className={`text-sm font-semibold ${
                    langkah.status === 'menunggu' ? 'text-muted' : 'text-foreground'
                  }`}
                >
                  {langkah.judul}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{langkah.deskripsi}</p>
                {langkah.href && langkah.label_cta ? (
                  <Link href={langkah.href} className="btn-primary mt-3">
                    {langkah.label_cta}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
