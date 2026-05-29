'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { IkonNav } from '@/components/ikon-nav';
import { TombolKeluar } from '@/components/tombol-keluar';
import { daftar_nav_dashboard } from '@/lib/jalur-navigasi';

type PropsSidebarDashboard = {
  email_pengguna: string;
  jumlah_belum_dibaca?: number;
  children: React.ReactNode;
};

function nav_aktif(jalur_saat_ini: string, jalur_item: string) {
  if (jalur_item === '/dashboard') {
    return jalur_saat_ini === '/dashboard';
  }
  return jalur_saat_ini.startsWith(jalur_item);
}

export function LayoutSidebarDashboard({ email_pengguna, jumlah_belum_dibaca = 0, children }: PropsSidebarDashboard) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <BrandLogo ukuran={32} />
          <span className="text-base font-semibold tracking-tight text-foreground">MediGuard</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Dashboard">
          {daftar_nav_dashboard.map((item) => {
            const aktif = nav_aktif(pathname, item.jalur);
            return (
              <Link
                key={item.jalur}
                href={item.jalur}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  aktif
                    ? 'bg-accent-soft text-accent'
                    : 'text-muted hover:bg-slate-50 hover:text-foreground'
                }`}
                aria-current={aktif ? 'page' : undefined}
              >
                <IkonNav jenis={item.ikon} />
                <span className="flex-1">{item.nama}</span>
                {item.jalur === '/dashboard' && jumlah_belum_dibaca > 0 ? (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {jumlah_belum_dibaca > 99 ? '99+' : jumlah_belum_dibaca}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-4 py-4">
          <p className="truncate text-xs text-muted" title={email_pengguna}>
            {email_pengguna}
          </p>
          <div className="mt-3">
            <TombolKeluar />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrandLogo ukuran={28} />
            <span className="font-semibold text-foreground">MediGuard</span>
          </Link>
          <TombolKeluar className="!w-auto px-4" />
        </header>

        <nav
          className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden"
          aria-label="Dashboard mobile"
        >
          {daftar_nav_dashboard.map((item) => {
            const aktif = nav_aktif(pathname, item.jalur);
            return (
              <Link
                key={item.jalur}
                href={item.jalur}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                  aktif ? 'bg-accent-soft text-accent' : 'text-muted'
                }`}
              >
                <IkonNav jenis={item.ikon} className="h-4 w-4" />
                {item.nama}
              </Link>
            );
          })}
        </nav>

        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-700">
          For informational purposes only — not medical advice. Always consult your healthcare provider or pharmacist.
        </div>

        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.035]" />
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
}
