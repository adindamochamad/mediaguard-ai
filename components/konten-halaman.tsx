type PropsKontenHalaman = {
  children: React.ReactNode;
  className?: string;
  lebar?: 'sm' | 'md' | 'lg' | 'xl';
};

const LEBAR_KELAS: Record<NonNullable<PropsKontenHalaman['lebar']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

/**
 * Wrapper halaman — konten di atas latar Three.js dengan panel kaca semi-transparan.
 */
export function KontenHalaman({
  children,
  className = '',
  lebar = 'lg',
}: PropsKontenHalaman) {
  return (
    <div className={`mx-auto w-full ${LEBAR_KELAS[lebar]} ${className}`.trim()}>
      {children}
    </div>
  );
}
