import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { NodeGraf } from "../constants/graf-alur";
import { GRAF_LAYOUT } from "../constants/graf-alur";
import { SPRING_MASUK, SPRING_SOROT } from "../lib/animasi-halus";
import { kapital } from "../lib/gaya-teks";

interface Props {
  node: NodeGraf;
  aktif: boolean;
}

export const GrafNode: React.FC<Props> = ({ node, aktif }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lebar = GRAF_LAYOUT.lebar_node;
  const tinggi = GRAF_LAYOUT.tinggi_node;
  const cabang = node.tier === "cabang";

  const masuk = spring({
    frame: frame - node.muncul_frame,
    fps,
    config: SPRING_MASUK,
  });

  if (frame < node.muncul_frame - 1) return null;

  const opacity = interpolate(masuk, [0, 1], [0, 1]);
  const skala_masuk = interpolate(masuk, [0, 1], [0.9, 1]);

  const sorot = aktif
    ? spring({
        frame: frame - node.muncul_frame,
        fps,
        config: SPRING_SOROT,
      })
    : 0;
  const napas = aktif ? 1 + 0.012 * Math.sin(frame / 24) : 0;
  const skala_sorot = interpolate(sorot, [0, 1], [1, 1.028]);
  const skala = skala_masuk * (aktif ? skala_sorot * napas : 1);

  const glow = interpolate(sorot, [0, 1], [0, 1]);
  const border_alpha = cabang
    ? 0.28 + glow * 0.45
    : 0.4 + glow * 0.4;

  return (
    <div
      style={{
        position: "absolute",
        left: node.x - lebar / 2,
        top: node.y - tinggi / 2,
        width: lebar,
        height: tinggi,
        opacity,
        transform: `scale(${skala})`,
        transformOrigin: "center center",
        zIndex: aktif ? 20 : cabang ? 12 : 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          background: aktif
            ? `linear-gradient(160deg, rgba(13,148,136,${0.25 + glow * 0.2}), rgba(15,23,42,0.96))`
            : cabang
              ? "rgba(15,23,42,0.88)"
              : "rgba(15,23,42,0.94)",
          border: `${aktif ? 2 : 1.5}px solid rgba(94,234,212,${border_alpha})`,
          borderRadius: cabang ? 12 : 14,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: aktif
            ? `0 0 ${28 + glow * 24}px rgba(13,148,136,${0.25 + glow * 0.2})`
            : "0 6px 20px rgba(0,0,0,0.28)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `rgba(13,148,136,${0.1 + glow * 0.28})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {node.ikon}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: aktif ? "#f0fdfa" : "#e2e8f0",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            lineHeight: 1.2,
            textAlign: "center",
            flex: 1,
          }}
        >
          {kapital(node.label)}
        </span>
      </div>
    </div>
  );
};
