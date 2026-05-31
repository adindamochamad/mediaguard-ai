import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tag = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const h1 = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 60 } });
  const sub = spring({ frame: frame - 22, fps, config: { damping: 14, stiffness: 60 } });

  const tagOpacity = interpolate(tag, [0, 1], [0, 1]);
  const tagY = interpolate(tag, [0, 1], [20, 0]);
  const h1Opacity = interpolate(h1, [0, 1], [0, 1]);
  const h1Y = interpolate(h1, [0, 1], [30, 0]);
  const subOpacity = interpolate(sub, [0, 1], [0, 1]);

  // Teal glow pulse
  const glowScale = 1 + 0.05 * Math.sin(frame / 30);

  return (
    <Bg>
      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: 1400,
        }}
      >
        {/* Tag */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(13,148,136,0.12)",
            border: "1px solid rgba(13,148,136,0.35)",
            borderRadius: 100,
            padding: "8px 24px",
            marginBottom: 32,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d9488", display: "inline-block" }} />
          <span style={{ color: "#0d9488", fontSize: 20, fontWeight: 600, letterSpacing: 2 }}>
            DEVELOPERWEEK NYC 2026
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            opacity: h1Opacity,
            transform: `translateY(${h1Y}px)`,
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.08,
            color: "#f8fafc",
            margin: "0 0 28px",
            letterSpacing: -2,
          }}
        >
          Medication safety intelligence
          <br />
          <span style={{ color: "#0d9488" }}>you can trace to the source</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            opacity: subOpacity,
            fontSize: 32,
            color: "#94a3b8",
            margin: 0,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          Add your medications once. MediGuard watches FDA, PubMed &amp; medical news
          <br />
          and delivers personalized alerts — before your next appointment.
        </p>
      </div>
    </Bg>
  );
};
