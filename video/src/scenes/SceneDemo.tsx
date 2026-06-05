import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Series } from "remotion";
import { Bg } from "../components/Bg";
import { SceneFade } from "../components/SceneFade";
import { ScreenshotFrame } from "../components/ScreenshotFrame";
import { LowerThird } from "../components/LowerThird";
import { Badge } from "../components/Teks";
import { kapital } from "../lib/gaya-teks";
import { SCREENSHOT } from "../constants/screenshots";
import {
  DURASI_SCENE_DEMO,
  DURASI_SCENE_DEMO_CAREGIVER,
} from "../constants/durasi-video";

const DURASI_CAREGIVER_SLIDE = Math.floor(DURASI_SCENE_DEMO_CAREGIVER / 2);

const Label: React.FC<{ text: string; sub: string; delay: number }> = ({
  text,
  sub,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const x = interpolate(p, [0, 1], [-24, 0]);

  return (
    <div style={{ opacity, transform: `translateX(${x}px)` }}>
      <div
        style={{
          fontSize: 38,
          fontWeight: 800,
          color: "#f8fafc",
          marginBottom: 10,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          lineHeight: 1.2,
        }}
      >
        {kapital(text)}
      </div>
      <div
        style={{
          fontSize: 20,
          color: "#64748b",
          lineHeight: 1.5,
          whiteSpace: "pre-line",
          textTransform: "uppercase",
          letterSpacing: 0.4,
          fontWeight: 600,
        }}
      >
        {kapital(sub)}
      </div>
    </div>
  );
};

const DemoSlide: React.FC<{
  label: string;
  sub: string;
  imgSrc: string;
  badge?: string;
  lowerThird?: string;
  warna_badge?: "teal" | "merah";
}> = ({ label, sub, imgSrc, badge, lowerThird, warna_badge = "teal" }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 72,
        padding: "60px 100px",
      }}
    >
      <div style={{ flex: "0 0 420px" }}>
        {badge && <Badge warna={warna_badge}>{badge}</Badge>}
        <Label text={label} sub={sub} delay={8} />
      </div>
      <div style={{ flex: 1, maxWidth: 1100 }}>
        <ScreenshotFrame src={imgSrc} delay={0} kenBurns durasi_ken_burns={260} />
      </div>
    </div>
    {lowerThird && <LowerThird teks={lowerThird} />}
  </>
);

export const SceneDemo: React.FC = () => (
  <Bg>
    <SceneFade durasi_frame={DURASI_SCENE_DEMO}>
      <DemoSlide
        badge="Feature 01 · medications"
        label="Your medications. One list."
        sub={
          "Add once — background scan every 6 hours.\nFDA · PubMed · DailyMed · medical news."
        }
        imgSrc={SCREENSHOT.obat}
        lowerThird="Medication profile — start of the pipeline"
      />
    </SceneFade>
  </Bg>
);

export const SceneDemoAlerts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dotP = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const dotScale = interpolate(dotP, [0, 1], [0, 1]);

  return (
    <Bg>
      <SceneFade durasi_frame={DURASI_SCENE_DEMO}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 72,
            padding: "60px 100px",
          }}
        >
          <div style={{ flex: "0 0 420px" }}>
            <Badge warna="merah">Feature 02 · realtime alerts</Badge>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#f8fafc",
                marginBottom: 12,
                lineHeight: 1.2,
                textTransform: "uppercase",
              }}
            >
              {kapital("Alerts land live. No refresh.")}
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#64748b",
                lineHeight: 1.6,
                textTransform: "uppercase",
                fontWeight: 600,
                letterSpacing: 0.4,
              }}
            >
              {kapital(
                "Scan now → Nimble → Claude → push in under 60 seconds. Two users, different lists, different alerts."
              )}
            </div>
            <span
              style={{
                display: "inline-block",
                marginTop: 16,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
                transform: `scale(${dotScale})`,
                boxShadow: "0 0 12px #ef4444",
              }}
            />
          </div>
          <div style={{ flex: 1, maxWidth: 1100 }}>
            <ScreenshotFrame
              src={SCREENSHOT.alert_dashboard}
              delay={0}
              kenBurns
              durasi_ken_burns={260}
            />
          </div>
        </div>
        <LowerThird teks="Realtime branch — live dashboard push" />
      </SceneFade>
    </Bg>
  );
};

export const SceneDemoDetail: React.FC = () => (
  <Bg>
    <SceneFade durasi_frame={DURASI_SCENE_DEMO}>
      <DemoSlide
        badge="Whoa moment · FDA recall"
        label="Real FDA recall. Real lot numbers."
        sub={
          "Atorvastatin class II — Ascend Laboratories.\n141,000+ bottles · matched to patient statin."
        }
        imgSrc={SCREENSHOT.alert_detail}
        lowerThird="Primary source linked · plain-language summary"
      />
    </SceneFade>
  </Bg>
);

export const SceneDemoChat: React.FC = () => (
  <Bg>
    <SceneFade durasi_frame={DURASI_SCENE_DEMO}>
      <DemoSlide
        badge="Feature 03 · AI chat"
        label="Ask in plain language."
        sub={
          "Claude streams with live Nimble tool calls —\nnot a static FAQ or outdated database."
        }
        imgSrc={SCREENSHOT.chat}
        lowerThird="AI chat branch — cited live sources"
      />
    </SceneFade>
  </Bg>
);

export const SceneDemoCaregiver: React.FC = () => (
  <Bg>
    <SceneFade durasi_frame={DURASI_SCENE_DEMO_CAREGIVER}>
      <Series>
        <Series.Sequence durationInFrames={DURASI_CAREGIVER_SLIDE}>
          <DemoSlide
            badge="Feature 04 · caregiver"
            label="Invite family in one click."
            sub={
              "Resend magic link instantly.\nRead-only — no account for caregivers."
            }
            imgSrc={SCREENSHOT.email_caregiver}
            lowerThird="Caregiver branch — email invite"
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURASI_SCENE_DEMO_CAREGIVER - DURASI_CAREGIVER_SLIDE}>
          <DemoSlide
            badge="Magic link view"
            label="Shared alerts. Zero signup."
            sub={
              "Caregivers see critical alerts\nwithout full account access."
            }
            imgSrc={SCREENSHOT.caregiver}
            lowerThird="RLS-safe read-only token"
          />
        </Series.Sequence>
      </Series>
    </SceneFade>
  </Bg>
);
