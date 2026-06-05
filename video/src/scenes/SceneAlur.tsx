import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";
import { GrafCabang } from "../components/GrafCabang";
import { GrafGaris } from "../components/GrafGaris";
import { GrafNode } from "../components/GrafNode";
import { PanelKeterangan } from "../components/PanelKeterangan";
import { LabelAtas } from "../components/Teks";
import { kapital } from "../lib/gaya-teks";
import { drift_halus, SPRING_MASUK } from "../lib/animasi-halus";
import {
  CABANG_GRAF,
  DURASI_SCENE_ALUR,
  FASE_KETERANGAN,
  GRAF_LAYOUT,
  NODES_GRAF,
  TEPI_GRAF,
} from "../constants/graf-alur";

const peta_node = Object.fromEntries(NODES_GRAF.map((n) => [n.id, n]));
const HT = GRAF_LAYOUT.tinggi_node / 2;
const SPREAD_VISUAL = GRAF_LAYOUT.spread_x + 80;

function ambil_node_aktif(frame: number): string {
  let aktif = NODES_GRAF[0].id;
  for (const n of NODES_GRAF) {
    if (frame >= n.muncul_frame + 8) aktif = n.id;
  }
  return aktif;
}

const GarisPanduan: React.FC<{ opacity: number }> = ({ opacity }) => {
  const baris_y = [0, 1, 2, 3, 4, 5, 6, 7].map(
    (i) => GRAF_LAYOUT.y_awal + i * GRAF_LAYOUT.jarak_baris
  );
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        pointerEvents: "none",
        opacity,
      }}
    >
      {baris_y.map((yy) => (
        <line
          key={yy}
          x1={GRAF_LAYOUT.pusat_x - SPREAD_VISUAL}
          y1={yy}
          x2={GRAF_LAYOUT.pusat_x + SPREAD_VISUAL}
          y2={yy}
          stroke="rgba(13,148,136,0.06)"
          strokeWidth={1}
          strokeDasharray="8 12"
        />
      ))}
      <line
        x1={GRAF_LAYOUT.pusat_x}
        y1={GRAF_LAYOUT.y_awal - 40}
        x2={GRAF_LAYOUT.pusat_x}
        y2={GRAF_LAYOUT.y_awal + 7 * GRAF_LAYOUT.jarak_baris + 40}
        stroke="rgba(13,148,136,0.08)"
        strokeWidth={1}
      />
    </svg>
  );
};

export const SceneAlur: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const id_aktif = ambil_node_aktif(frame);

  const header_masuk = spring({ frame, fps, config: SPRING_MASUK });
  const header_opacity = interpolate(header_masuk, [0, 1], [0, 1]);
  const header_y = interpolate(header_masuk, [0, 1], [16, 0]);

  const zoom_graf = drift_halus(frame, 0, DURASI_SCENE_ALUR, 1.035, 1);
  const opacity_panduan = drift_halus(frame, 20, 90, 0, 1);

  const panel_masuk = spring({
    frame: frame - 24,
    fps,
    config: SPRING_MASUK,
  });
  const panel_opacity = interpolate(panel_masuk, [0, 1], [0, 1]);
  const panel_y = interpolate(panel_masuk, [0, 1], [12, 0]);

  const tepi_trunk = useMemo(
    () =>
      TEPI_GRAF.map((t) => {
        const a = peta_node[t.dari];
        const b = peta_node[t.ke];
        if (!a || !b) return null;
        return (
          <GrafGaris
            key={`${t.dari}-${t.ke}`}
            id_unik={`trunk-${t.dari}-${t.ke}`}
            x1={a.x}
            y1={a.y + HT}
            x2={b.x}
            y2={b.y - HT}
            muncul_frame={t.muncul_frame}
            durasi_gambar={50}
          />
        );
      }),
    []
  );

  const cabang_render = useMemo(
    () =>
      CABANG_GRAF.map((c) => {
        const induk = peta_node[c.induk_id];
        const [idK, idT, idKn] = c.anak_ids;
        const kiri = peta_node[idK];
        const tengah = peta_node[idT];
        const kanan = peta_node[idKn];
        if (!induk || !kiri || !tengah || !kanan) return null;
        return (
          <GrafCabang
            key={`cabang-${c.induk_id}-${c.arah}`}
            id_unik={`cabang-${c.induk_id}-${c.arah}`}
            induk={{ x: induk.x, y: induk.y }}
            anak_kiri={{ x: kiri.x, y: kiri.y }}
            anak_tengah={{ x: tengah.x, y: tengah.y }}
            anak_kanan={{ x: kanan.x, y: kanan.y }}
            muncul_frame={c.muncul_frame}
            arah={c.arah}
            durasi_gambar={54}
          />
        );
      }),
    []
  );

  return (
    <Bg>
      <SceneFade durasi_frame={DURASI_SCENE_ALUR} fade_frame={20}>
        <div style={{ position: "absolute", inset: 0 }}>
          <div
            style={{
              position: "absolute",
              top: 32,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: header_opacity,
              transform: `translateY(${header_y}px)`,
              zIndex: 30,
            }}
          >
            <LabelAtas style={{ marginBottom: 6 }}>
              Product flow — connected pipeline
            </LabelAtas>
            <div
              style={{
                fontSize: 17,
                color: "#64748b",
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {kapital("Trunk on center axis · three-way branches")}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${zoom_graf})`,
              transformOrigin: `${GRAF_LAYOUT.pusat_x}px ${GRAF_LAYOUT.y_awal + 3.5 * GRAF_LAYOUT.jarak_baris}px`,
            }}
          >
            <GarisPanduan opacity={opacity_panduan} />
            {cabang_render}
            {tepi_trunk}
            {NODES_GRAF.map((node) => (
              <GrafNode key={node.id} node={node} aktif={node.id === id_aktif} />
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: `translateX(-50%) translateY(${panel_y}px)`,
              width: 1080,
              opacity: panel_opacity,
              zIndex: 30,
            }}
          >
            <div
              style={{
                background: "rgba(2,6,23,0.92)",
                border: "1px solid rgba(13,148,136,0.4)",
                borderRadius: 14,
                padding: "16px 32px 20px",
                backdropFilter: "blur(12px)",
              }}
            >
              <PanelKeterangan fase={FASE_KETERANGAN} />
            </div>
          </div>
        </div>
      </SceneFade>
    </Bg>
  );
};

