import React from "react";
import { Composition } from "remotion";
import { MediGuardVideo } from "./MediGuardVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MediGuardVideo"
      component={MediGuardVideo}
      durationInFrames={1620}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
