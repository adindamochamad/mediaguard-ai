import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { GRAF_LAYOUT } from "../constants/graf-alur";
import { progres_keluar } from "../lib/animasi-halus";

interface Titik {
  x: number;
  y: number;
}

interface Props {
  induk: Titik;
  anak_kiri: Titik;
  anak_tengah: Titik;
  anak_kanan: Titik;
  muncul_frame: number;
  arah: "turun" | "naik";
  id_unik: string;
  durasi_gambar?: number;
}

const setengah_tinggi = GRAF_LAYOUT.tinggi_node / 2;

export const GrafCabang: React.FC<Props> = ({
  induk,
  anak_kiri,
  anak_tengah,
  anak_kanan,
  muncul_frame,
  arah,
  id_unik,
  durasi_gambar = 52,
}) => {
  const frame = useCurrentFrame();
  const progres = progres_keluar(frame, muncul_frame, durasi_gambar);

  if (progres <= 0) return null;

  const turun = arah === "turun";
  const y_induk = turun ? induk.y + setengah_tinggi : induk.y - setengah_tinggi;
  const y_anak = turun
    ? (a: Titik) => a.y - setengah_tinggi
    : (a: Titik) => a.y + setengah_tinggi;

  const y_stub = turun ? y_induk + 20 : y_induk - 20;
  const y_bus = (y_stub + y_anak(anak_tengah)) / 2;

  const d = [
    `M ${induk.x} ${y_induk}`,
    `L ${induk.x} ${y_bus}`,
    `L ${anak_kiri.x} ${y_bus}`,
    `L ${anak_kiri.x} ${y_anak(anak_kiri)}`,
    `M ${induk.x} ${y_bus}`,
    `L ${anak_tengah.x} ${y_bus}`,
    `L ${anak_tengah.x} ${y_anak(anak_tengah)}`,
    `M ${induk.x} ${y_bus}`,
    `L ${anak_kanan.x} ${y_bus}`,
    `L ${anak_kanan.x} ${y_anak(anak_kanan)}`,
  ].join(" ");

  const panjang_perkiraan = 1280;
  const dashoffset = panjang_perkiraan * (1 - progres);
  const opacity_garis = interpolate(progres, [0, 0.12], [0, 0.9], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const titik_bus = interpolate(progres, [0.35, 0.65], [0, 1], {
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
        strokeLinejoin="round"
        strokeDasharray={panjang_perkiraan}
        strokeDashoffset={dashoffset}
        opacity={opacity_garis}
      />
      <circle
        cx={induk.x}
        cy={y_bus}
        r={5}
        fill="#5eead4"
        opacity={titik_bus * 0.85}
        style={{ filter: "blur(0.5px)" }}
      />
    </svg>
  );
};
