import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";
import { LabelAtas, JudulBesar } from "../components/Teks";
import { kapital } from "../lib/gaya-teks";
import { DURASI_SCENE_PROBLEM } from "../constants/durasi-video";

const Stat: React.FC<{
  value: string;
  label: string;
  delay: number;
  color?: string;
}> = ({ value, label, delay, color = "#0d9488" }) => {
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
        padding: "36px 32px",
        background: "rgba(15,23,42,0.7)",
        border: "1px solid rgba(13,148,136,0.2)",
        borderRadius: 24,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 800, color, lineHeight: 1, marginBottom: 12 }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 17,
          color: "#94a3b8",
          lineHeight: 1.45,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          fontWeight: 600,
        }}
      >
        {kapital(label)}
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

  const quoteP = spring({ frame: frame - 55, fps, config: { damping: 14, stiffness: 60 } });
  const quoteOpacity = interpolate(quoteP, [0, 1], [0, 1]);

  return (
    <Bg>
      <SceneFade durasi_frame={DURASI_SCENE_PROBLEM}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 44,
            padding: "0 120px",
          }}
        >
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              textAlign: "center",
            }}
          >
            <LabelAtas>The problem</LabelAtas>
            <JudulBesar ukuran={60} aksen="The patient never heard.">
              The warning was published.
            </JudulBesar>
          </div>

          <div style={{ display: "flex", gap: 28, width: "100%", maxWidth: 1500 }}>
            <Stat
              value="125K"
              label="US deaths per year linked to adverse drug events"
              delay={20}
              color="#f87171"
            />
            <Stat
              value="450+"
              label="FDA drug safety communications in 2024 alone"
              delay={35}
              color="#fb923c"
            />
            <Stat
              value="53M"
              label="Unpaid caregivers managing meds with no safety tools"
              delay={50}
              color="#fbbf24"
            />
          </div>

          <div
            style={{
              opacity: quoteOpacity,
              borderLeft: "4px solid #0d9488",
              paddingLeft: 32,
              maxWidth: 1000,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: 22,
                color: "#cbd5e1",
                lineHeight: 1.6,
                margin: 0,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                fontWeight: 500,
              }}
            >
              {kapital(
                "A family member learned about a dangerous interaction from the news — three months after the FDA warning. MediGuard alerts the same day."
              )}
            </p>
          </div>
        </div>
      </SceneFade>
    </Bg>
  );
};
