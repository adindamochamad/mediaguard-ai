import Image from 'next/image';
import Link from 'next/link';
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
        No alerts yet. MediGuard checks FDA.gov (Food and Drug Administration), PubMed, and medical news against your medication
        list — click <strong className="text-foreground">Scan now</strong> above to run your first
        check.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/medications"
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-slate-50"
        >
          Review your medications
        </Link>
      </div>
      <p className="mt-6 text-xs text-muted">
        MediGuard does not replace your doctor or pharmacist.
      </p>
    </div>
  );
}
