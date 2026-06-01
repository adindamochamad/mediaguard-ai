import Image from 'next/image';
import { JALUR_BRAND } from '@/lib/jalur-brand';

type PropsLogo = {
  ukuran?: number;
  className?: string;
  prioritas?: boolean;
};

export function BrandLogo({ ukuran = 36, className = '', prioritas = false }: PropsLogo) {
  return (
    <Image
      src={JALUR_BRAND.logoHeader}
      alt=""
      width={ukuran}
      height={ukuran}
      className={`rounded-lg object-contain ${className}`.trim()}
      priority={prioritas}
      aria-hidden
    />
  );
}
