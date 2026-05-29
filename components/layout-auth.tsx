import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

type PropsLayoutAuth = {
  children: React.ReactNode;
  judul: string;
  deskripsi: string;
};

export function LayoutAuth({ children, judul, deskripsi }: PropsLayoutAuth) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">

      {/* ── Left branding panel (desktop only) ─────────────────── */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 p-12">

        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-[0.07]" />

        {/* Gradient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <BrandLogo ukuran={40} />
          <span className="text-xl font-semibold tracking-tight text-white">MediGuard AI</span>
        </div>

        {/* Center */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            <p className="text-[2.15rem] font-semibold leading-tight text-white">
              The FDA alert from yesterday.
              <br />
              <span className="text-teal-300">Maria knows today.</span>
            </p>
            <p className="max-w-sm text-base leading-relaxed text-white/60">
              Real-time medication safety intelligence — personalized to your list, traced to the source.
            </p>
          </div>

          {/* Floating alert card mockup */}
          <div className="glass-card max-w-sm rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-red-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                Critical
              </span>
              <span className="text-xs text-white/50">fda.gov · detected 4h ago</span>
            </div>
            <p className="mt-2.5 text-sm font-semibold leading-snug text-white">
              Warfarin — Increased Bleeding Risk with Concurrent NSAID Use
            </p>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/55">
              The FDA has updated safety labeling for Warfarin to strengthen warnings about concurrent
              use with ibuprofen or naproxen. Co-administration significantly increases bleeding risk.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-md border border-white/20 px-2 py-0.5 text-[11px] text-white/60">
                View details
              </span>
              <span className="rounded-md bg-teal-500/30 px-2 py-0.5 text-[11px] font-medium text-teal-200">
                Mark as read
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            {[
              { value: '131M', label: 'Americans on Rx' },
              { value: '< 6h', label: 'Detection time' },
              { value: '0.75+', label: 'AI confidence min' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative text-xs text-white/40">
          Powered by Nimble · Anthropic Claude · Supabase Realtime
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────────────── */}
      <div className="flex min-h-screen flex-col bg-background lg:min-h-0">

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
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              {/* Desktop logo above form */}
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
