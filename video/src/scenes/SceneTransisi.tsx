import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";
import { JudulBesar, Subteks } from "../components/Teks";
import { DURASI_SCENE_TRANSISI } from "../constants/durasi-video";

export const SceneTransisi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame, fps, config: { damping: 14, stiffness: 65 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const y = interpolate(p, [0, 1], [40, 0]);
  const panah = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: "clamp" });

  return (
    <Bg>
      <SceneFade durasi_frame={DURASI_SCENE_TRANSISI}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 160px",
            opacity,
            transform: `translateY(${y}px)`,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#0d9488",
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Flow complete
          </div>
          <JudulBesar ukuran={72}>Now see it in the product</JudulBesar>
          <div style={{ marginTop: 28 }}>
            <Subteks ukuran={26}>
              Real screenshots · real FDA recall · live dashboard
            </Subteks>
          </div>
          <div
            style={{
              marginTop: 48,
              fontSize: 64,
              color: "#0d9488",
              transform: `translateY(${interpolate(panah, [0, 1], [0, 12])}px)`,
              opacity: panah,
            }}
          >
            ↓
          </div>
        </div>
      </SceneFade>
    </Bg>
  );
};
