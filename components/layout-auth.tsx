import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

type PropsLayoutAuth = {
  children: React.ReactNode;
  judul: string;
  deskripsi: string;
};

export function LayoutAuth({ children, judul, deskripsi }: PropsLayoutAuth) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden min-h-screen flex-col bg-[#1a3330] lg:flex">
        <div className="flex items-center gap-3 px-10 pt-10">
          <BrandLogo ukuran={34} />
          <span className="text-base font-semibold text-white">MediGuard AI</span>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-8 px-10 py-10">
          <div className="flex flex-wrap gap-2">
            {['FDA', 'PubMed', 'Medical news'].map((src) => (
              <span
                key={src}
                className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-white/70"
              >
                {src}
              </span>
            ))}
          </div>

          <div>
            <h2 className="font-display text-4xl leading-[1.12] text-white lg:text-[2.5rem]">
              The alert from yesterday.
              <br />
              <span className="text-teal-200/90">Maria reads it today.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Medication safety intelligence — personalized to your list, traced to its source.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-2">
              <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Critical
              </span>
              <span className="text-[11px] text-white/45">fda.gov · 4h ago</span>
            </div>
            <p className="mt-2.5 text-sm font-semibold leading-snug text-white">
              Warfarin — Increased Bleeding Risk with Concurrent NSAID Use
            </p>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/50">
              The FDA has updated safety labeling for Warfarin to strengthen warnings about
              concurrent use with ibuprofen or naproxen.
            </p>
          </div>

          <div className="flex gap-8 border-t border-white/10 pt-6">
            {[
              { value: '131M', label: 'Americans on Rx' },
              { value: '< 6h', label: 'Detection time' },
              { value: '0.75+', label: 'Confidence min' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-semibold text-white">{s.value}</p>
                <p className="mt-0.5 text-[11px] text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-10 pb-8">
          <p className="text-[11px] text-white/35">Nimble · Anthropic Claude · Supabase</p>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col bg-transparent">
        <header className="header-kaca relative z-10 lg:hidden">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo ukuran={32} />
              <span className="text-base font-semibold text-foreground">MediGuard AI</span>
            </Link>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <div className="mb-6 hidden justify-center lg:flex">
                <Link href="/" className="flex items-center gap-2.5">
                  <BrandLogo ukuran={34} />
                  <span className="text-base font-semibold text-foreground">MediGuard AI</span>
                </Link>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">{judul}</h1>
              <p className="mt-2 text-sm text-muted">{deskripsi}</p>
            </div>

            <div className="card-surface p-6 shadow-card sm:p-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
