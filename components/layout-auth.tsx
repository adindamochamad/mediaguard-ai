import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

type PropsLayoutAuth = {
  children: React.ReactNode;
  judul: string;
  deskripsi: string;
};

export function LayoutAuth({ children, judul, deskripsi }: PropsLayoutAuth) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">

      {/* ── Left branding panel ─────────────────────────────────── */}
      <div className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900">

        {/* Decorative layer */}
        <div className="absolute inset-0 bg-dot-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/5 blur-2xl" />

        {/* ── Top: Logo ── */}
        <div className="relative flex items-center gap-3 px-10 pt-10">
          <BrandLogo ukuran={36} />
          <span className="text-lg font-semibold tracking-tight text-white">MediGuard AI</span>
        </div>

        {/* ── Middle: Content (fills remaining height) ── */}
        <div className="relative flex flex-1 flex-col justify-center gap-8 px-10 py-10">

          {/* Source badge */}
          <div className="flex flex-wrap gap-2">
            {['Food and Drug Administration (FDA)', 'PubMed', 'DailyMed'].map((src) => (
              <span
                key={src}
                className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-medium text-white/60 backdrop-blur-sm"
              >
                {src}
              </span>
            ))}
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-4xl font-bold leading-[1.15] tracking-tight text-white lg:text-[2.6rem]">
              The alert from yesterday.
              <br />
              <span className="text-teal-300">Maria reads it today.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-white/55">
              Real-time medication safety intelligence — personalized to your list, traced to its source.
            </p>
          </div>

          {/* Primary alert card */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-red-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                Critical
              </span>
              <span className="text-[11px] text-white/45">fda.gov · detected 4h ago</span>
            </div>
            <p className="mt-2.5 text-[0.9rem] font-semibold leading-snug text-white">
              Warfarin — Increased Bleeding Risk with Concurrent NSAID Use
            </p>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/50">
              The Food and Drug Administration (FDA) has updated safety labeling for Warfarin
              to strengthen warnings about concurrent use with ibuprofen or naproxen.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md border border-white/20 px-2.5 py-1 text-[11px] text-white/55">
                View details
              </span>
              <span className="rounded-md bg-teal-500/25 px-2.5 py-1 text-[11px] font-medium text-teal-200">
                Mark as read
              </span>
              <span className="ml-auto text-[11px] text-white/35">
                confidence 0.94
              </span>
            </div>
          </div>

          {/* Secondary scan status card */}
          <div className="glass-card rounded-xl px-5 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/30 text-[11px] text-teal-300">
                  ✓
                </span>
                <span className="text-sm font-medium text-white/80">Scan complete</span>
              </div>
              <span className="text-[11px] text-white/40">21s</span>
            </div>
            <p className="mt-1.5 text-xs text-white/45 pl-8.5">
              7 sources crawled · 2 new alerts · 0 duplicates
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 border-t border-white/10 pt-6">
            {[
              { value: '131M', label: 'Americans on Rx' },
              { value: '< 6h', label: 'Detection time' },
              { value: '0.75+', label: 'AI confidence min' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="mt-0.5 text-[11px] text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom: Powered by ── */}
        <div className="relative px-10 pb-8">
          <p className="text-[11px] text-white/35">
            Powered by Nimble · Anthropic Claude · Supabase Realtime
          </p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────── */}
      <div className="flex min-h-screen flex-col bg-background">

        {/* Mobile header only */}
        <header className="border-b border-border/80 bg-card/80 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo ukuran={32} />
              <span className="text-lg font-semibold tracking-tight text-foreground">MediGuard AI</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:py-16">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <div className="mb-6 hidden justify-center lg:flex">
                <Link href="/" className="flex items-center gap-2.5">
                  <BrandLogo ukuran={36} />
                  <span className="text-lg font-semibold tracking-tight text-foreground">MediGuard AI</span>
                </Link>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{judul}</h1>
              <p className="mt-2 text-sm text-muted">{deskripsi}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
