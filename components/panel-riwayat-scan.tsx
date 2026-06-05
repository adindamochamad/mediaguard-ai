import Link from 'next/link';
import { TabelRiwayatScan, type BarisLogScan } from '@/components/tabel-riwayat-scan';

export function PanelRiwayatScan({ riwayat }: { riwayat: BarisLogScan[] }) {
  if (riwayat.length === 0) return null;

  return (
    <div className="card-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Scan history</h2>
        <Link
          href="/dashboard/history"
          className="text-sm font-medium text-accent hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="mt-4">
        <TabelRiwayatScan riwayat={riwayat} varian="ringkas" />
      </div>
    </div>
  );
}
