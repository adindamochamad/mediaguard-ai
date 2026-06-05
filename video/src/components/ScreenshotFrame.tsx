import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig, Easing } from "remotion";
import { URL_DEMO } from "../constants/screenshots";
import { SPRING_MASUK, drift_halus } from "../lib/animasi-halus";

interface Props {
  src: string;
  delay?: number;
  /** Zoom halus selama scene berjalan — cocok untuk demo UI */
  kenBurns?: boolean;
  /** Durasi zoom (frame lokal scene); wajib jika kenBurns di dalam Series pendek */
  durasi_ken_burns?: number;
}

export const ScreenshotFrame: React.FC<Props> = ({
  src,
  delay = 0,
  kenBurns = false,
  durasi_ken_burns = 140,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_MASUK,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [28, 0], {
    easing: Easing.out(Easing.cubic),
  });
  const masuk = interpolate(progress, [0, 1], [0.96, 1], {
    easing: Easing.out(Easing.cubic),
  });
  const zoom_ken = kenBurns
    ? drift_halus(frame, delay, delay + durasi_ken_burns, 1, 1.04)
    : 1;
  const skala = masuk * zoom_ken;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${skala})`,
        transformOrigin: "center center",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08), 0 0 60px rgba(13,148,136,0.12)",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ef4444",
            display: "inline-block",
          }}
        />
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#f59e0b",
            display: "inline-block",
          }}
        />
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#22c55e",
            display: "inline-block",
          }}
        />
        <div
          style={{
            marginLeft: 12,
            background: "#0f172a",
            borderRadius: 6,
            padding: "4px 16px",
            color: "#64748b",
            fontSize: 14,
            flex: 1,
            maxWidth: 400,
          }}
        >
          {URL_DEMO}
        </div>
      </div>
      <img src={src} style={{ display: "block", width: "100%" }} alt="" />
    </div>
  );
};
