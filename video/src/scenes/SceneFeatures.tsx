import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";
import { LabelAtas, JudulBesar } from "../components/Teks";
import { kapital } from "../lib/gaya-teks";
import { DURASI_SCENE_FEATURES } from "../constants/durasi-video";

const Card: React.FC<{ icon: string; title: string; body: string; delay: number }> = ({
  icon,
  title,
  body,
  delay,
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
        padding: "32px 28px",
        flex: 1,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "#f1f5f9",
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {kapital(title)}
      </div>
      <div
        style={{
          fontSize: 16,
          color: "#64748b",
          lineHeight: 1.55,
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        {kapital(body)}
      </div>
    </div>
  );
};

const BarisBanding: React.FC<{ lama: string; baru: string; delay: number }> = ({
  lama,
  baru,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 70 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        width: "100%",
        maxWidth: 1200,
      }}
    >
      <div
        style={{
          padding: "20px 28px",
          borderRadius: 16,
          background: "rgba(127,29,29,0.15)",
          border: "1px solid rgba(248,113,113,0.25)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#f87171",
            fontWeight: 800,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Today
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#fca5a5",
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: 0.4,
          }}
        >
          {kapital(lama)}
        </div>
      </div>
      <div
        style={{
          padding: "20px 28px",
          borderRadius: 16,
          background: "rgba(13,148,136,0.12)",
          border: "1px solid rgba(13,148,136,0.35)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#0d9488",
            fontWeight: 800,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          MediGuard AI
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#99f6e4",
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: 0.4,
          }}
        >
          {kapital(baru)}
        </div>
      </div>
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
      <SceneFade durasi_frame={DURASI_SCENE_FEATURES}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            padding: "48px 100px",
          }}
        >
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              textAlign: "center",
            }}
          >
            <LabelAtas>Why judges should care</LabelAtas>
            <JudulBesar ukuran={52} aksen="Personal medication safety intelligence">
              New category
            </JudulBesar>
          </div>

          <BarisBanding
            lama="FDA MedWatch — 100K generic alerts/year, zero personalization"
            baru="Only YOUR list · confidence-scored · source-linked"
            delay={18}
          />

          <div style={{ display: "flex", gap: 24, width: "100%" }}>
            <Card
              icon="🌐"
              title="Nimble = live web"
              body="Structured extract from FDA, PubMed, DailyMed — no brittle scrapers"
              delay={32}
            />
            <Card
              icon="🤖"
              title="Claude = relevance"
              body="Filters noise before it reaches the patient dashboard"
              delay={46}
            />
            <Card
              icon="⚡"
              title="Realtime = demo magic"
              body="Supabase push + Resend email on critical severity"
              delay={60}
            />
          </div>
        </div>
      </SceneFade>
    </Bg>
  );
};
