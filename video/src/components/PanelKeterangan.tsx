import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { kapital } from "../lib/gaya-teks";

interface Fase {
  mulai_frame: number;
  teks: string;
}

interface Props {
  fase: Fase[];
  frame_global?: number;
}

const DURASI_CROSSFADE = 22;

/** Teks bawah dengan crossfade halus antar fase */
export const PanelKeterangan: React.FC<Props> = ({ fase }) => {
  const frame = useCurrentFrame();

  let indeks = 0;
  for (let i = 0; i < fase.length; i++) {
    if (frame >= fase[i].mulai_frame) indeks = i;
  }

  const saat_ini = fase[indeks];
  const berikutnya = fase[indeks + 1];
  const frame_rel = frame - saat_ini.mulai_frame;

  let opacity_saat = 1;
  let opacity_berikut = 0;
  let teks_tampil = saat_ini.teks;

  if (berikutnya) {
    const jarak_ke_berikut = berikutnya.mulai_frame - frame;
    if (jarak_ke_berikut < DURASI_CROSSFADE && jarak_ke_berikut >= 0) {
      const t = 1 - jarak_ke_berikut / DURASI_CROSSFADE;
      opacity_saat = interpolate(t, [0, 1], [1, 0], {
        easing: Easing.inOut(Easing.quad),
      });
      opacity_berikut = interpolate(t, [0, 1], [0, 1], {
        easing: Easing.inOut(Easing.quad),
      });
      teks_tampil = saat_ini.teks;
    } else if (jarak_ke_berikut < 0) {
      opacity_saat = 0;
      opacity_berikut = 1;
      teks_tampil = berikutnya.teks;
    }
  }

  const masuk_awal = interpolate(frame_rel, [0, 28], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "relative",
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          position: "absolute",
          margin: 0,
          fontSize: 20,
          color: "#5eead4",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
          lineHeight: 1.45,
          opacity: masuk_awal * opacity_saat,
          maxWidth: 1000,
          textAlign: "center",
        }}
      >
        {kapital(teks_tampil)}
      </p>
      {berikutnya && opacity_berikut > 0 && (
        <p
          style={{
            position: "absolute",
            margin: 0,
            fontSize: 20,
            color: "#5eead4",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            lineHeight: 1.45,
            opacity: masuk_awal * opacity_berikut,
            maxWidth: 1000,
            textAlign: "center",
          }}
        >
          {kapital(berikutnya.teks)}
        </p>
      )}
    </div>
  );
};
