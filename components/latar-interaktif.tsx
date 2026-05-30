'use client';

import { useEffect, useRef } from 'react';

/**
 * Latar belakang ambient interaktif untuk panel terang.
 * - Blob aurora bergerak pelan (animasi CSS)
 * - Grid garis halus dengan mask lembut
 * - Glow teal yang mengikuti posisi kursor (sisi "interaktif")
 * Menghormati prefers-reduced-motion: gerak kursor & aurora nonaktif otomatis.
 */
export function LatarInteraktif({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemen = ref.current;
    if (!elemen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let bingkai = 0;
    function tangani_gerak(peristiwa: PointerEvent) {
      cancelAnimationFrame(bingkai);
      bingkai = requestAnimationFrame(() => {
        const kotak = elemen!.getBoundingClientRect();
        const x = ((peristiwa.clientX - kotak.left) / kotak.width) * 100;
        const y = ((peristiwa.clientY - kotak.top) / kotak.height) * 100;
        elemen!.style.setProperty('--mx', `${x}%`);
        elemen!.style.setProperty('--my', `${y}%`);
      });
    }

    window.addEventListener('pointermove', tangani_gerak);
    return () => {
      window.removeEventListener('pointermove', tangani_gerak);
      cancelAnimationFrame(bingkai);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Grid garis */}
      <div className="absolute inset-0 bg-grid-fine opacity-90" />

      {/* Blob aurora — lebih besar, terang, dan masuk ke area pandang */}
      <div className="absolute -left-24 -top-24 h-[40rem] w-[40rem] rounded-full bg-teal-300/60 blur-3xl animate-aurora-a" />
      <div className="absolute -bottom-32 -right-20 h-[36rem] w-[36rem] rounded-full bg-cyan-300/55 blur-3xl animate-aurora-b" />
      <div
        className="absolute left-[35%] top-[28%] h-[24rem] w-[24rem] rounded-full bg-sky-300/45 blur-3xl animate-aurora-a"
        style={{ animationDelay: '-8s' }}
      />
      <div
        className="absolute right-[20%] bottom-[18%] h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl animate-aurora-b"
        style={{ animationDelay: '-14s' }}
      />

      {/* Glow mengikuti kursor — lebih besar & terang */}
      <div className="absolute inset-0 opacity-90 transition-[background] duration-200 ease-out [background:radial-gradient(34rem_34rem_at_var(--mx,50%)_var(--my,12%),var(--accent-soft),transparent_62%)]" />
    </div>
  );
}
