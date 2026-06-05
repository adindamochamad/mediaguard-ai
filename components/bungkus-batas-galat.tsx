'use client';

import { BatasGalat } from '@/components/batas-galat';
import type { ReactNode } from 'react';

type PropsBungkus = {
  children: ReactNode;
  nama_bagian?: string;
  judul?: string;
  petunjuk?: string;
};

/** Pembungkus tipis agar halaman server bisa membungkus anak client dengan BatasGalat. */
export function BungkusBatasGalat({ children, nama_bagian, judul, petunjuk }: PropsBungkus) {
  return (
    <BatasGalat nama_bagian={nama_bagian} judul={judul} petunjuk={petunjuk}>
      {children}
    </BatasGalat>
  );
}
