import { Easing, interpolate, SpringConfig } from "remotion";

/** Spring lembut untuk masuk node / UI */
export const SPRING_MASUK: SpringConfig = {
  damping: 24,
  stiffness: 52,
  mass: 0.85,
};

/** Spring untuk sorot node aktif */
export const SPRING_SOROT: SpringConfig = {
  damping: 32,
  stiffness: 42,
};

/** Progres 0→1 dengan easing keluar (gerakan natural) */
export function progres_keluar(
  frame: number,
  mulai: number,
  durasi: number
): number {
  return interpolate(frame, [mulai, mulai + durasi], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

/** Fade masuk/keluar halus */
export function fade_halus(
  frame: number,
  mulai: number,
  selesai: number
): number {
  return interpolate(frame, [mulai, selesai], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
}

/** Zoom / drift sangat pelan */
export function drift_halus(
  frame: number,
  mulai: number,
  selesai: number,
  dari: number,
  ke: number
): number {
  return interpolate(frame, [mulai, selesai], [dari, ke], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
}
