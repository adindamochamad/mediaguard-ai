import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";
import { JudulBesar, Subteks } from "../components/Teks";
import { kapital } from "../lib/gaya-teks";
import { URL_DEMO } from "../constants/screenshots";
import { DURASI_SCENE_CTA } from "../constants/durasi-video";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p1 = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const p2 = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 60 } });
  const p3 = spring({ frame: frame - 24, fps, config: { damping: 14, stiffness: 60 } });
  const p4 = spring({ frame: frame - 38, fps, config: { damping: 14, stiffness: 60 } });

  const o1 = interpolate(p1, [0, 1], [0, 1]);
  const o2 = interpolate(p2, [0, 1], [0, 1]);
  const o3 = interpolate(p3, [0, 1], [0, 1]);
  const o4 = interpolate(p4, [0, 1], [0, 1]);

  const glowScale = 1 + 0.04 * Math.sin(frame / 25);

  const stack = [
    { label: "Next.js 14", color: "#f1f5f9" },
    { label: "Nimble API", color: "#0d9488" },
    { label: "Claude Sonnet", color: "#f59e0b" },
    { label: "Supabase Realtime", color: "#3ecf8e" },
    { label: "Resend", color: "#818cf8" },
  ];

  return (
    <Bg>
      <SceneFade durasi_frame={DURASI_SCENE_CTA}>
        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${glowScale})`,
            width: 800,
            height: 800,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            padding: "0 120px",
          }}
        >
          <div style={{ opacity: o1, textAlign: "center" }}>
            <JudulBesar ukuran={80}>MediGuard AI</JudulBesar>
          </div>

          <div style={{ opacity: o2, textAlign: "center" }}>
            <Subteks ukuran={28}>
              Real-time safety intelligence — personalized, source-linked, built for
              patients and caregivers
            </Subteks>
          </div>

          <div
            style={{
              opacity: o3,
              background: "rgba(13,148,136,0.1)",
              border: "1.5px solid rgba(13,148,136,0.4)",
              borderRadius: 16,
              padding: "16px 48px",
            }}
          >
            <span
              style={{
                fontSize: 32,
                color: "#5eead4",
                fontWeight: 700,
                fontFamily: "monospace",
                textTransform: "uppercase",
              }}
            >
              {URL_DEMO}
            </span>
          </div>

          <div
            style={{
              opacity: o4,
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {stack.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 100,
                  padding: "10px 22px",
                  color: s.color,
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {kapital(s.label)}
              </div>
            ))}
          </div>

          <div
            style={{
              opacity: o4,
              fontSize: 17,
              color: "#475569",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            {kapital("DeveloperWeek NYC 2026")}
            <br />
            {kapital("Nimble Challenge + Overall Track")}
          </div>

          <p
            style={{
              opacity: o4,
              fontSize: 15,
              color: "#334155",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            {kapital("Informational only — not medical advice. Consult your clinician.")}
          </p>
        </div>
      </SceneFade>
    </Bg>
  );
};
