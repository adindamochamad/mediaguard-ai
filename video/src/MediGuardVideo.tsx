import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { SceneHook } from "./scenes/SceneHook";
import { SceneProblem } from "./scenes/SceneProblem";
import { SceneAlur } from "./scenes/SceneAlur";
import { SceneTransisi } from "./scenes/SceneTransisi";
import {
  SceneDemo,
  SceneDemoAlerts,
  SceneDemoDetail,
  SceneDemoChat,
  SceneDemoCaregiver,
} from "./scenes/SceneDemo";
import { SceneFeatures } from "./scenes/SceneFeatures";
import { SceneCTA } from "./scenes/SceneCTA";
import {
  DURASI_SCENE_HOOK,
  DURASI_SCENE_PROBLEM,
  DURASI_SCENE_ALUR,
  DURASI_SCENE_TRANSISI,
  DURASI_SCENE_DEMO,
  DURASI_SCENE_DEMO_CAREGIVER,
  DURASI_SCENE_FEATURES,
  DURASI_SCENE_CTA,
  DURASI_TOTAL_FRAME,
  DURASI_TOTAL_DETIK,
  DURASI_MAKS_DETIK,
} from "./constants/durasi-video";

export {
  DURASI_TOTAL_FRAME,
  DURASI_TOTAL_DETIK,
  DURASI_MAKS_DETIK,
};

// 30 fps · 2:55 maks — graf alur dulu, lalu demo fitur

export const MediGuardVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#020617" }}>
      <Series>
        <Series.Sequence durationInFrames={DURASI_SCENE_HOOK}>
          <SceneHook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_PROBLEM}>
          <SceneProblem />
        </Series.Sequence>
        {/* Alur produk — motion graphics poin per poin (sebelum fitur) */}
        <Series.Sequence durationInFrames={DURASI_SCENE_ALUR}>
          <SceneAlur />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_TRANSISI}>
          <SceneTransisi />
        </Series.Sequence>
        {/* Demo fitur di produk */}
        <Series.Sequence durationInFrames={DURASI_SCENE_DEMO}>
          <SceneDemo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_DEMO}>
          <SceneDemoAlerts />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_DEMO}>
          <SceneDemoDetail />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_DEMO}>
          <SceneDemoChat />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_DEMO_CAREGIVER}>
          <SceneDemoCaregiver />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_FEATURES}>
          <SceneFeatures />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_CTA}>
          <SceneCTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
