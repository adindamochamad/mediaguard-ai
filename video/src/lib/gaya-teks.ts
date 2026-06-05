import type { CSSProperties } from "react";

/** Semua label section — ALL CAPS */
export const gaya_label: CSSProperties = {
  fontSize: 22,
  color: "#0d9488",
  fontWeight: 700,
  letterSpacing: 3,
  textTransform: "uppercase",
};

/** Headline utama — ALL CAPS */
export const gaya_judul: CSSProperties = {
  fontWeight: 800,
  color: "#f8fafc",
  textTransform: "uppercase",
  letterSpacing: -0.5,
};

/** Subteks — ALL CAPS, ukuran lebih kecil */
export const gaya_sub: CSSProperties = {
  color: "#94a3b8",
  lineHeight: 1.55,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

/** Badge pill */
export const gaya_badge: CSSProperties = {
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
};

/** Paksa string ke huruf kapital untuk copy */
export function kapital(teks: string): string {
  return teks.toUpperCase();
}
