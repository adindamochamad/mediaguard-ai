import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";

const Stat: React.FC<{ value: string; label: string; delay: number; color?: string }> = ({
  value, label, delay, color = "#0d9488",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 70 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const y = interpolate(p, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: "center",
        padding: "40px 48px",
        background: "rgba(15,23,42,0.7)",
        border: "1px solid rgba(13,148,136,0.2)",
        borderRadius: 24,
        minWidth: 320,
      }}
    >
      <div style={{ fontSize: 80, fontWeight: 800, color, lineHeight: 1, marginBottom: 12 }}>
        {value}
      </div>
      <div style={{ fontSize: 22, color: "#94a3b8", lineHeight: 1.4, maxWidth: 280, margin: "0 auto" }}>
        {label}
      </div>
    </div>
  );
};

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1]);
  const titleY = interpolate(titleP, [0, 1], [30, 0]);

  const quoteP = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 60 } });
  const quoteOpacity = interpolate(quoteP, [0, 1], [0, 1]);

  return (
    <Bg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48, padding: "0 120px" }}>
        {/* Title */}
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <div style={{ fontSize: 22, color: "#0d9488", fontWeight: 600, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>
            The Problem
          </div>
          <h2 style={{ fontSize: 64, fontWeight: 800, color: "#f8fafc", margin: 0, lineHeight: 1.1 }}>
            The information exists.
            <br />
            <span style={{ color: "#f87171" }}>It never reaches patients.</span>
          </h2>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
          <Stat value="125K" label="deaths annually linked to adverse drug events in the US" delay={20} color="#f87171" />
          <Stat value="450+" label="FDA drug safety communications published in 2024 alone" delay={35} color="#fb923c" />
          <Stat value="53M" label="unpaid caregivers managing prescriptions with no safety tools" delay={50} color="#fbbf24" />
        </div>

        {/* Quote */}
        <div
          style={{
            opacity: quoteOpacity,
            borderLeft: "4px solid #0d9488",
            paddingLeft: 32,
            maxWidth: 900,
            textAlign: "left",
          }}
        >
          <p style={{ fontSize: 28, color: "#cbd5e1", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
            "35% of clinicians ignore routine safety alerts — not because they don't care,
            but because the alerts aren't personalized. Patients receive zero proactive notifications."
          </p>
        </div>
      </div>
    </Bg>
  );
};
