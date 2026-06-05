import React from "react";
import { Composition } from "remotion";
import { MediGuardVideo, DURASI_TOTAL_FRAME } from "./MediGuardVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MediGuardVideo"
      component={MediGuardVideo}
      durationInFrames={DURASI_TOTAL_FRAME}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
