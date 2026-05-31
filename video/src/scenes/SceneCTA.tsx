import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p1 = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const p2 = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 60 } });
  const p3 = spring({ frame: frame - 28, fps, config: { damping: 14, stiffness: 60 } });
  const p4 = spring({ frame: frame - 42, fps, config: { damping: 14, stiffness: 60 } });

  const o1 = interpolate(p1, [0, 1], [0, 1]);
  const o2 = interpolate(p2, [0, 1], [0, 1]);
  const o3 = interpolate(p3, [0, 1], [0, 1]);
  const o4 = interpolate(p4, [0, 1], [0, 1]);

  const glowScale = 1 + 0.04 * Math.sin(frame / 25);

  const stack = [
    { label: "Next.js 14", color: "#f1f5f9" },
    { label: "Nimble API", color: "#0d9488" },
    { label: "Anthropic Claude", color: "#f59e0b" },
    { label: "Supabase Realtime", color: "#3ecf8e" },
    { label: "Resend Email", color: "#818cf8" },
  ];

  return (
    <Bg>
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, padding: "0 120px" }}>
        {/* Main tagline */}
        <div style={{ opacity: o1, textAlign: "center" }}>
          <h2 style={{ fontSize: 88, fontWeight: 800, color: "#f8fafc", margin: 0, lineHeight: 1.05, letterSpacing: -2 }}>
            MediGuard AI
          </h2>
        </div>

        <div style={{ opacity: o2, textAlign: "center" }}>
          <p style={{ fontSize: 34, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
            <em>Your medications, monitored 24/7.</em>
            <br />
            <em>Alerts before your doctor calls.</em>
          </p>
        </div>

        {/* URL */}
        <div
          style={{
            opacity: o3,
            background: "rgba(13,148,136,0.1)",
            border: "1.5px solid rgba(13,148,136,0.4)",
            borderRadius: 16,
            padding: "16px 48px",
          }}
        >
          <span style={{ fontSize: 30, color: "#5eead4", fontWeight: 600, fontFamily: "monospace" }}>
            mediguard.adindamochamad.com
          </span>
        </div>

        {/* Tech stack pills */}
        <div style={{ opacity: o4, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {stack.map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 100,
                padding: "10px 24px",
                color: s.color,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Hackathon badge */}
        <div
          style={{
            opacity: o4,
            fontSize: 20,
            color: "#475569",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          DeveloperWeek NYC 2026 · Nimble Challenge + Overall Track
        </div>
      </div>
    </Bg>
  );
};
