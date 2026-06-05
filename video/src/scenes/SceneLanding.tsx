import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";
import { ScreenshotFrame } from "../components/ScreenshotFrame";
import { SCREENSHOT } from "../constants/screenshots";

const DURASI = 90;

export const SceneLanding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const judul = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const opacity = interpolate(judul, [0, 1], [0, 1]);
  const y = interpolate(judul, [0, 1], [24, 0]);

  return (
    <Bg>
      <SceneFade durasi_frame={DURASI}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 64,
            padding: "48px 100px",
          }}
        >
          <div style={{ flex: "0 0 440px", opacity, transform: `translateY(${y}px)` }}>
            <div
              style={{
                fontSize: 20,
                color: "#0d9488",
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Patient-facing product
            </div>
            <h2
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0 0 20px",
                lineHeight: 1.15,
              }}
            >
              Trace every alert
              <br />
              <span style={{ color: "#0d9488" }}>to FDA · PubMed · DailyMed</span>
            </h2>
            <p style={{ fontSize: 24, color: "#94a3b8", lineHeight: 1.55, margin: 0 }}>
              Not a static drug checker. A live intelligence layer for caregivers and patients.
            </p>
          </div>
          <div style={{ flex: 1, maxWidth: 1000 }}>
            <ScreenshotFrame src={SCREENSHOT.landing} delay={8} kenBurns />
          </div>
        </div>
      </SceneFade>
    </Bg>
  );
};

export const DURASI_SCENE_LANDING = DURASI;
