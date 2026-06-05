import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";

interface Props {
  children: React.ReactNode;
  durasi_frame: number;
  fade_frame?: number;
}

export const SceneFade: React.FC<Props> = ({
  children,
  durasi_frame,
  fade_frame = 18,
}) => {
  const frame = useCurrentFrame();
  const fade_masuk = interpolate(frame, [0, fade_frame], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fade_keluar = interpolate(
    frame,
    [durasi_frame - fade_frame, durasi_frame],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );
  const opacity = Math.min(fade_masuk, fade_keluar);

  return (
    <div style={{ width: "100%", height: "100%", opacity }}>{children}</div>
  );
};
