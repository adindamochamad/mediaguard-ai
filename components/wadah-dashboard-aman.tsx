'use client';

import { BatasGalat } from '@/components/batas-galat';

type PropsWadah = {
  children: React.ReactNode;
};

/** Bungkus seluruh konten dashboard — tangkap error yang tidak tertangkap bagian lain. */
export function WadahDashboardAman({ children }: PropsWadah) {
  return (
    <BatasGalat
      nama_bagian="dashboard-root"
      judul="Dashboard unavailable"
      petunjuk="Refresh the page. If Supabase or AI services are down, try again later or check /api/health/* endpoints."
    >
      {children}
    </BatasGalat>
  );
}
