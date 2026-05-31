import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { SceneHook } from "./scenes/SceneHook";
import { SceneProblem } from "./scenes/SceneProblem";
import { ScenePipeline } from "./scenes/ScenePipeline";
import { SceneDemo, SceneDemoAlerts, SceneDemoDetail, SceneDemoChat, SceneDemoCaregiver } from "./scenes/SceneDemo";
import { SceneFeatures } from "./scenes/SceneFeatures";
import { SceneCTA } from "./scenes/SceneCTA";

// Total duration at 30fps:
// Hook:          120f =  4s
// Problem:       180f =  6s
// Pipeline:      210f =  7s
// Demo:          150f =  5s  (medications)
// Demo Alerts:   150f =  5s
// Demo Detail:   150f =  5s  (Atorvastatin whoa)
// Demo Chat:     150f =  5s
// Demo Caregiver:150f =  5s
// Features:      180f =  6s
// CTA:           180f =  6s
// TOTAL:        1620f = 54s

export const MediGuardVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#020617" }}>
      <Series>
        <Series.Sequence durationInFrames={120}>
          <SceneHook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <SceneProblem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={210}>
          <ScenePipeline />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <SceneDemo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <SceneDemoAlerts />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <SceneDemoDetail />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <SceneDemoChat />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <SceneDemoCaregiver />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <SceneFeatures />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <SceneCTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
