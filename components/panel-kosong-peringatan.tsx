import Image from 'next/image';
import { JALUR_BRAND } from '@/lib/jalur-brand';

export function PanelKosongPeringatan() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-soft sm:py-16">
      <div className="relative mb-6 h-40 w-full max-w-xs overflow-hidden rounded-xl">
        <Image
          src={JALUR_BRAND.emptyState}
          alt=""
          fill
          className="object-contain"
          sizes="320px"
          aria-hidden
        />
      </div>
      <h2 className="text-xl font-semibold text-foreground">We&apos;re monitoring for you</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        No alerts yet. Add your medications, then run a scan to see personalized safety updates
        linked to FDA and PubMed sources.
      </p>
      <p className="mt-6 text-xs text-muted">
        MediGuard does not replace your doctor or pharmacist.
      </p>
    </div>
  );
}
