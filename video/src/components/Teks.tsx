import React from "react";
import { gaya_badge, gaya_judul, gaya_label, gaya_sub, kapital } from "../lib/gaya-teks";

interface LabelAtasProps {
  children: string;
  style?: React.CSSProperties;
}

export const LabelAtas: React.FC<LabelAtasProps> = ({ children, style }) => (
  <div style={{ ...gaya_label, marginBottom: 14, ...style }}>{kapital(children)}</div>
);

interface JudulBesarProps {
  children: string;
  ukuran?: number;
  aksen?: string;
  style?: React.CSSProperties;
}

export const JudulBesar: React.FC<JudulBesarProps> = ({
  children,
  ukuran = 56,
  aksen,
  style,
}) => (
  <h2 style={{ ...gaya_judul, fontSize: ukuran, margin: 0, lineHeight: 1.12, ...style }}>
    {kapital(children)}
    {aksen ? (
      <>
        <br />
        <span style={{ color: "#0d9488" }}>{kapital(aksen)}</span>
      </>
    ) : null}
  </h2>
);

interface SubteksProps {
  children: string;
  ukuran?: number;
  style?: React.CSSProperties;
}

export const Subteks: React.FC<SubteksProps> = ({ children, ukuran = 24, style }) => (
  <p style={{ ...gaya_sub, fontSize: ukuran, margin: 0, ...style }}>{kapital(children)}</p>
);

interface BadgeProps {
  children: string;
  warna?: "teal" | "merah";
}

export const Badge: React.FC<BadgeProps> = ({ children, warna = "teal" }) => {
  const teal = {
    bg: "rgba(13,148,136,0.12)",
    border: "rgba(13,148,136,0.35)",
    color: "#0d9488",
  };
  const merah = {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.35)",
    color: "#ef4444",
  };
  const p = warna === "merah" ? merah : teal;
  return (
    <div
      style={{
        display: "inline-block",
        background: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: 100,
        padding: "6px 18px",
        color: p.color,
        fontSize: 17,
        marginBottom: 20,
        ...gaya_badge,
      }}
    >
      {kapital(children)}
    </div>
  );
};
