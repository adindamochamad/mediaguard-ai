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
      <aside className="header-kaca hidden w-60 shrink-0 flex-col md:flex md:sticky md:top-0 md:h-screen">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <BrandLogo ukuran={30} />
          <span className="text-base font-semibold text-foreground">MediGuard</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="Dashboard">
          {daftar_nav_dashboard.map((item) => {
            const aktif = nav_aktif(pathname, item.jalur);
            return (
              <Link
                key={item.jalur}
                href={item.jalur}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  aktif
                    ? 'border-l-2 border-accent bg-accent-soft/60 pl-[10px] text-accent'
                    : 'border-l-2 border-transparent text-muted hover:bg-stone-50 hover:text-foreground'
                }`}
                aria-current={aktif ? 'page' : undefined}
              >
                <IkonNav jenis={item.ikon} />
                <span className="flex-1">{item.nama}</span>
                {item.jalur === '/dashboard' && jumlah_belum_dibaca > 0 ? (
                  <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
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
        <header className="header-kaca flex h-14 items-center justify-between px-4 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrandLogo ukuran={28} />
            <span className="font-semibold text-foreground">MediGuard</span>
          </Link>
          <TombolKeluar className="!w-auto px-4" />
        </header>

        <nav
          className="header-kaca flex gap-1 overflow-x-auto px-2 py-2 md:hidden"
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

        <div className="border-b border-teal-200/60 bg-teal-50/70 px-4 py-2 text-center text-xs text-teal-900/80 backdrop-blur-sm">
          For informational purposes only — not medical advice.
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
