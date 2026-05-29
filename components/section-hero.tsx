import Image from 'next/image';
import { JALUR_BRAND } from '@/lib/jalur-brand';

export function SectionHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">

      {/* Background image */}
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <Image
          src={JALUR_BRAND.heroBackground}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
      </div>

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-dot-grid opacity-[0.06]" aria-hidden />

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/95 to-background/60" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_70%_10%,var(--accent-soft),transparent)] opacity-70" aria-hidden />

      {/* Gradient blobs */}
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[600px] w-[600px] rounded-full bg-teal-100/60 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute right-1/4 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-100/50 blur-2xl" aria-hidden />

      <div className="mx-auto max-w-6xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3 py-1 text-xs font-medium text-muted shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
          DeveloperWeek NYC 2026 · Hackathon Project
        </p>

        <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          Medication safety intelligence you can{' '}
          <span className="text-accent">trace to the source</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          MediGuard monitors your medication list against Food and Drug Administration (FDA) labels and live web signals — surfacing
          high-confidence alerts with links to primary sources. Built for caregivers and patients, not
          to replace your clinician.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5"
          >
            Create free account
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card/90 px-6 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-slate-50"
          >
            Sign in
          </a>
        </div>

        {/* Social proof bar */}
        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-border/60 pt-8">
          {[
            { label: 'FDA.gov', sub: 'Drug safety alerts' },
            { label: 'PubMed', sub: 'Drug interaction studies' },
            { label: 'DailyMed', sub: 'Label updates' },
          ].map((src) => (
            <div key={src.label} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              <span className="text-sm font-medium text-foreground">{src.label}</span>
              <span className="text-sm text-muted">{src.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
