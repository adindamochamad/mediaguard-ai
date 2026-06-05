import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { kapital } from "../lib/gaya-teks";
import { SPRING_MASUK } from "../lib/animasi-halus";

interface Props {
  teks: string;
  delay?: number;
}

export const LowerThird: React.FC<Props> = ({ teks, delay = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progres = spring({
    frame: frame - delay,
    fps,
    config: SPRING_MASUK,
  });
  const opacity = interpolate(progres, [0, 1], [0, 1]);
  const x = interpolate(progres, [0, 1], [-40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 48,
        left: 100,
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(2,6,23,0.85)",
        border: "1px solid rgba(13,148,136,0.35)",
        borderRadius: 12,
        padding: "12px 24px",
        backdropFilter: "blur(8px)",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#0d9488",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          color: "#e2e8f0",
          fontSize: 20,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {kapital(teks)}
      </span>
    </div>
  );
};
