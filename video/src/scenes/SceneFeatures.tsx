import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";

const Card: React.FC<{ icon: string; title: string; body: string; delay: number }> = ({
  icon, title, body, delay,
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
        background: "rgba(15,23,42,0.7)",
        border: "1px solid rgba(13,148,136,0.2)",
        borderRadius: 20,
        padding: "36px 32px",
        flex: 1,
      }}
    >
      <div style={{ fontSize: 44, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>{title}</div>
      <div style={{ fontSize: 19, color: "#64748b", lineHeight: 1.6 }}>{body}</div>
    </div>
  );
};

export const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleP = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1]);
  const titleY = interpolate(titleP, [0, 1], [24, 0]);

  return (
    <Bg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 52, padding: "60px 100px" }}>
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <div style={{ fontSize: 22, color: "#0d9488", fontWeight: 600, letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>
            What makes it different
          </div>
          <h2 style={{ fontSize: 60, fontWeight: 800, color: "#f8fafc", margin: 0 }}>
            Not a reminder app. Not a drug checker.
            <br />
            <span style={{ color: "#0d9488" }}>A continuous safety intelligence layer.</span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: 28, width: "100%" }}>
          <Card
            icon="⚡"
            title="Real-time, not cached"
            body="Nimble crawls FDA.gov, PubMed, and medical news on demand — not from a database updated months ago."
            delay={20}
          />
          <Card
            icon="🎯"
            title="Matched to your list"
            body="Claude AI reads the crawled content and filters to only the alerts relevant to your specific medications — confidence ≥ 0.75."
            delay={34}
          />
          <Card
            icon="📱"
            title="In your browser instantly"
            body="Supabase Realtime pushes alerts the moment the scan completes. Critical alerts trigger an immediate email."
            delay={48}
          />
          <Card
            icon="👨‍👩‍👧"
            title="Built for caregivers too"
            body="53M unpaid caregivers manage prescriptions with no tools. Magic link sharing — no account needed."
            delay={62}
          />
        </div>
      </div>
    </Bg>
  );
};
