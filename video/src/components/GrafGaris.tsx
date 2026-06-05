import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { progres_keluar } from "../lib/animasi-halus";

interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  muncul_frame: number;
  durasi_gambar?: number;
  id_unik: string;
}

export const GrafGaris: React.FC<Props> = ({
  x1,
  y1,
  x2,
  y2,
  muncul_frame,
  durasi_gambar = 48,
  id_unik,
}) => {
  const frame = useCurrentFrame();
  const progres = progres_keluar(frame, muncul_frame, durasi_gambar);

  if (progres <= 0) return null;

  const panjang = Math.abs(y2 - y1);
  const dashoffset = panjang * (1 - progres);
  const d = `M ${x1} ${y1} L ${x2} ${y2}`;
  const opacity_garis = interpolate(progres, [0, 0.15], [0, 0.92], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const titik = interpolate(progres, [0.82, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id={id_unik} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={`url(#${id_unik})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={panjang}
        strokeDashoffset={dashoffset}
        opacity={opacity_garis}
      />
      <circle cx={x2} cy={y2} r={4} fill="#5eead4" opacity={titik * 0.9} />
    </svg>
  );
};
