import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";

const Step: React.FC<{ icon: string; label: string; sub: string; delay: number; isLast?: boolean }> = ({
  icon, label, sub, delay, isLast = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 70 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const scale = interpolate(p, [0, 1], [0.8, 1]);

  const arrowP = spring({ frame: frame - delay - 5, fps, config: { damping: 20, stiffness: 80 } });
  const arrowOpacity = interpolate(arrowP, [0, 1], [0, 1]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          width: 200,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "rgba(13,148,136,0.15)",
            border: "2px solid rgba(13,148,136,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          {icon}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 700 }}>{label}</div>
          <div style={{ color: "#64748b", fontSize: 16, marginTop: 4 }}>{sub}</div>
        </div>
      </div>
      {!isLast && (
        <div
          style={{
            opacity: arrowOpacity,
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            marginBottom: 32,
          }}
        >
          <svg width="48" height="24" viewBox="0 0 48 24">
            <path d="M0 12 H40 M32 4 L40 12 L32 20" stroke="#0d9488" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

export const ScenePipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1]);

  const realtimeP = spring({ frame: frame - 80, fps, config: { damping: 14, stiffness: 60 } });
  const realtimeOpacity = interpolate(realtimeP, [0, 1], [0, 1]);
  const realtimeY = interpolate(realtimeP, [0, 1], [20, 0]);

  return (
    <Bg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56, padding: "0 80px" }}>
        {/* Title */}
        <div style={{ opacity: titleOpacity, textAlign: "center" }}>
          <div style={{ fontSize: 22, color: "#0d9488", fontWeight: 600, letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>
            How It Works
          </div>
          <h2 style={{ fontSize: 58, fontWeight: 800, color: "#f8fafc", margin: 0 }}>
            From live web to your screen in{" "}
            <span style={{ color: "#0d9488" }}>under 60 seconds</span>
          </h2>
        </div>

        {/* Pipeline steps */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Step icon="🌐" label="Nimble API" sub="FDA · PubMed · News" delay={10} />
          <Step icon="🤖" label="Claude AI" sub="Match · Score · Filter" delay={25} />
          <Step icon="🗄️" label="Supabase" sub="Store · Deduplicate" delay={40} />
          <Step icon="⚡" label="Realtime" sub="Push to browser" delay={55} />
          <Step icon="👤" label="Patient" sub="Alert + action steps" delay={70} isLast />
        </div>

        {/* Nimble callout */}
        <div
          style={{
            opacity: realtimeOpacity,
            transform: `translateY(${realtimeY}px)`,
            display: "flex",
            gap: 24,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            "Extract — FDA Safety Comms",
            "Extract — PubMed results",
            "Search — Medical news by drug",
            "RSS — FDA fallback feed",
            "Search — AI Chat live sources",
          ].map((use) => (
            <div
              key={use}
              style={{
                background: "rgba(13,148,136,0.1)",
                border: "1px solid rgba(13,148,136,0.3)",
                borderRadius: 100,
                padding: "8px 20px",
                color: "#5eead4",
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              Nimble: {use}
            </div>
          ))}
        </div>
      </div>
    </Bg>
  );
};
