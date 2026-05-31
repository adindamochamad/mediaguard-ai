import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Pill } from "./Pill";

type Severity = "critical" | "warning" | "info";

interface Props {
  severity: Severity;
  title: string;
  summary: string;
  source: string;
  delay?: number;
}

export const AlertCard: React.FC<Props> = ({ severity, title, summary, source, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 18], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const borderColor =
    severity === "critical" ? "#fca5a5" : severity === "warning" ? "#fcd34d" : "#93c5fd";

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: "rgba(15,23,42,0.85)",
        border: `1.5px solid ${borderColor}`,
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 16,
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <Pill severity={severity} />
        <span style={{ color: "#64748b", fontSize: 18 }}>{source}</span>
      </div>
      <div style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.5 }}>{summary}</div>
    </div>
  );
};
