import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";

const DURASI = 210;

const Step: React.FC<{
  icon: string;
  label: string;
  sub: string;
  delay: number;
  isLast?: boolean;
}> = ({ icon, label, sub, delay, isLast = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 70 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const scale = interpolate(p, [0, 1], [0.8, 1]);

  const arrowP = spring({
    frame: frame - delay - 5,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
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
          width: 190,
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "rgba(13,148,136,0.15)",
            border: "2px solid rgba(13,148,136,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
          }}
        >
          {icon}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#f1f5f9", fontSize: 19, fontWeight: 700 }}>{label}</div>
          <div style={{ color: "#64748b", fontSize: 15, marginTop: 4 }}>{sub}</div>
        </div>
      </div>
      {!isLast && (
        <div
          style={{
            opacity: arrowOpacity,
            display: "flex",
            alignItems: "center",
            padding: "0 6px",
            marginBottom: 32,
          }}
        >
          <svg width="44" height="24" viewBox="0 0 48 24">
            <path
              d="M0 12 H40 M32 4 L40 12 L32 20"
              stroke="#0d9488"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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

  const realtimeP = spring({ frame: frame - 75, fps, config: { damping: 14, stiffness: 60 } });
  const realtimeOpacity = interpolate(realtimeP, [0, 1], [0, 1]);
  const realtimeY = interpolate(realtimeP, [0, 1], [20, 0]);

  const nimbleUses = [
    "Extract → FDA Safety Communications",
    "Extract → PubMed studies",
    "Search → Medical news by drug",
    "Crawl → DailyMed labels",
    "Tool use → AI Chat live sources",
  ];

  return (
    <Bg>
      <SceneFade durasi_frame={DURASI}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            padding: "0 80px",
          }}
        >
          <div style={{ opacity: titleOpacity, textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                color: "#0d9488",
                fontWeight: 600,
                letterSpacing: 2,
                marginBottom: 14,
                textTransform: "uppercase",
              }}
            >
              Pipeline · Nimble Challenge
            </div>
            <h2 style={{ fontSize: 56, fontWeight: 800, color: "#f8fafc", margin: 0 }}>
              Live web → Claude → your screen in{" "}
              <span style={{ color: "#0d9488" }}>&lt; 60 seconds</span>
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Step icon="⏱" label="Cron / Scan" sub="Every 6h or manual" delay={8} />
            <Step icon="🌐" label="Nimble API" sub="FDA · PubMed · News" delay={22} />
            <Step icon="🤖" label="Claude AI" sub="Match · Score · Filter" delay={36} />
            <Step icon="🗄️" label="Supabase" sub="Dedup · RLS · Store" delay={50} />
            <Step icon="⚡" label="Realtime" sub="Browser + email" delay={64} isLast />
          </div>

          <div
            style={{
              opacity: realtimeOpacity,
              transform: `translateY(${realtimeY}px)`,
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              maxWidth: 1500,
            }}
          >
            {nimbleUses.map((use) => (
              <div
                key={use}
                style={{
                  background: "rgba(13,148,136,0.1)",
                  border: "1px solid rgba(13,148,136,0.3)",
                  borderRadius: 100,
                  padding: "8px 18px",
                  color: "#5eead4",
                  fontSize: 17,
                  fontWeight: 500,
                }}
              >
                {use}
              </div>
            ))}
          </div>
        </div>
      </SceneFade>
    </Bg>
  );
};

export const DURASI_SCENE_PIPELINE = DURASI;
