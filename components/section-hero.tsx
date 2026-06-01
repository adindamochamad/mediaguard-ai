import Image from 'next/image';
import { JALUR_BRAND } from '@/lib/jalur-brand';

export function SectionHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 px-6 pb-20 pt-16 sm:pb-24 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <Image
          src={JALUR_BRAND.heroBackground}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.08]"
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <p className="label-section">
          DeveloperWeek NYC 2026
        </p>

        <h1 className="font-display mt-6 max-w-3xl text-balance text-4xl leading-[1.08] text-foreground sm:text-5xl lg:text-[3.4rem]">
          Medication safety you can trace to the source
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          MediGuard monitors your medication list against FDA labels and live web signals —
          surfacing high-confidence alerts with links to primary sources. Built for patients and
          caregivers, not to replace your clinician.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href="/signup" className="btn-primary px-6 py-3">
            Create free account
          </a>
          <a href="/login" className="btn-secondary px-6 py-3">
            Sign in
          </a>
        </div>

        <div className="mt-14 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          {[
            { label: 'FDA.gov', sub: 'Drug safety alerts' },
            { label: 'PubMed', sub: 'Clinical studies' },
            { label: 'Medical news', sub: 'Safety headlines' },
          ].map((src) => (
            <div key={src.label}>
              <p className="text-sm font-semibold text-foreground">{src.label}</p>
              <p className="mt-1 text-sm text-muted">{src.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
