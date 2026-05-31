import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

interface Props {
  src: string;
  delay?: number;
  scale?: number;
}

export const ScreenshotFrame: React.FC<Props> = ({ src, delay = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [40, 0]);
  const s = interpolate(progress, [0, 1], [0.96, 1]) * scale;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${s})`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#1e293b",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
        <div
          style={{
            marginLeft: 12,
            background: "#0f172a",
            borderRadius: 6,
            padding: "4px 16px",
            color: "#64748b",
            fontSize: 14,
            flex: 1,
            maxWidth: 360,
          }}
        >
          mediguard.adindamochamad.com
        </div>
      </div>
      <img src={src} style={{ display: "block", width: "100%" }} alt="" />
    </div>
  );
};
