import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";
import { JudulBesar, Subteks } from "../components/Teks";
import { kapital } from "../lib/gaya-teks";
import { DURASI_SCENE_HOOK } from "../constants/durasi-video";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tag = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const h1 = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 60 } });
  const sub = spring({ frame: frame - 22, fps, config: { damping: 14, stiffness: 60 } });
  const kategori = spring({ frame: frame - 34, fps, config: { damping: 14, stiffness: 60 } });

  const tagOpacity = interpolate(tag, [0, 1], [0, 1]);
  const tagY = interpolate(tag, [0, 1], [20, 0]);
  const h1Opacity = interpolate(h1, [0, 1], [0, 1]);
  const h1Y = interpolate(h1, [0, 1], [30, 0]);
  const subOpacity = interpolate(sub, [0, 1], [0, 1]);
  const kategoriOpacity = interpolate(kategori, [0, 1], [0, 1]);

  const glowScale = 1 + 0.05 * Math.sin(frame / 30);

  return (
    <Bg>
      <SceneFade durasi_frame={DURASI_SCENE_HOOK}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${glowScale})`,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)",
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
            width: 1500,
          }}
        >
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
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#0d9488",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#0d9488",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {kapital("DeveloperWeek NYC 2026 · Nimble Challenge")}
            </span>
          </div>

          <div style={{ opacity: h1Opacity, transform: `translateY(${h1Y}px)` }}>
            <JudulBesar ukuran={88}>MediGuard AI</JudulBesar>
          </div>

          <p
            style={{
              opacity: subOpacity,
              fontSize: 36,
              color: "#5eead4",
              margin: "20px 0",
              fontWeight: 700,
              lineHeight: 1.35,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {kapital("Your personal medication safety intelligence agent")}
          </p>

          <div style={{ opacity: subOpacity }}>
            <Subteks ukuran={26}>
              Nimble crawls live medical web · Claude matches your list · Alerts with
              primary source links
            </Subteks>
          </div>

          <p
            style={{
              opacity: kategoriOpacity,
              marginTop: 36,
              fontSize: 17,
              color: "#64748b",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {kapital("Built for patients & caregivers — not hospital EHRs")}
          </p>
        </div>
      </SceneFade>
    </Bg>
  );
};
