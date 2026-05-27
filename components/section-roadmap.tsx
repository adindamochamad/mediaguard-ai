import Image from 'next/image';
import { JALUR_BRAND } from '@/lib/jalur-brand';

export function SectionRoadmap() {
  return (
    <section id="roadmap" className="border-t border-border px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Coming next</h2>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Your medication list, always in context
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Day 2 adds secure sign-in and the dashboard shell. Next up: medication CRUD and the
            Nimble → Claude scan pipeline.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            <li className="flex gap-2">
              <span className="font-semibold text-accent">✓</span>
              Auth + dashboard shell
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-accent">→</span>
              Medication list CRUD
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-accent">→</span>
              Manual scan &amp; deduplicated alerts
            </li>
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-soft">
          <Image
            src={JALUR_BRAND.emptyState}
            alt="Preview of an empty medication list screen in MediGuard"
            width={1448}
            height={1086}
            className="h-auto w-full rounded-xl object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
