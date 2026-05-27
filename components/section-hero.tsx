import Image from 'next/image';
import { JALUR_BRAND } from '@/lib/jalur-brand';

export function SectionHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <Image
          src={JALUR_BRAND.heroBackground}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/55"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_70%_20%,var(--accent-soft),transparent)] opacity-80"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3 py-1 text-xs font-medium text-muted shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          DeveloperWeek NYC 2026 · MVP scaffold
        </p>
        <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          Medication safety intelligence you can{' '}
          <span className="text-accent">trace to the source</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          MediGuard monitors your medication list against FDA labels and live web signals — surfacing
          high-confidence alerts with links to primary sources. Built for caregivers and patients, not
          to replace your clinician.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-teal-700"
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
      </div>
    </section>
  );
}
