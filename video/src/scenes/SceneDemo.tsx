import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { Bg } from "../components/Bg";
import { ScreenshotFrame } from "../components/ScreenshotFrame";

const Label: React.FC<{ text: string; sub: string; delay: number }> = ({ text, sub, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 60 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const x = interpolate(p, [0, 1], [-24, 0]);

  return (
    <div style={{ opacity, transform: `translateX(${x}px)` }}>
      <div style={{ fontSize: 40, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>{text}</div>
      <div style={{ fontSize: 22, color: "#64748b", lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
};

// Single demo slide: label left, screenshot right
const DemoSlide: React.FC<{
  label: string;
  sub: string;
  imgSrc: string;
  badge?: string;
}> = ({ label, sub, imgSrc, badge }) => {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 72, padding: "60px 100px" }}>
      {/* Left */}
      <div style={{ flex: "0 0 420px" }}>
        {badge && (
          <div
            style={{
              display: "inline-block",
              background: "rgba(13,148,136,0.12)",
              border: "1px solid rgba(13,148,136,0.3)",
              borderRadius: 100,
              padding: "6px 18px",
              color: "#0d9488",
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 24,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {badge}
          </div>
        )}
        <Label text={label} sub={sub} delay={8} />
      </div>
      {/* Right */}
      <div style={{ flex: 1, maxWidth: 1100 }}>
        <ScreenshotFrame src={imgSrc} delay={0} />
      </div>
    </div>
  );
};

export const SceneDemo: React.FC = () => {
  return (
    <Bg>
      <DemoSlide
        badge="Live Demo"
        label="9 medications. One dashboard."
        sub={"Add once — MediGuard monitors FDA, PubMed\nand medical news every 6 hours."}
        imgSrc="screenshots/Screenshot 2026-05-31 at 00.54.59.png"
      />
    </Bg>
  );
};

export const SceneDemoAlerts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dotP = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const dotScale = interpolate(dotP, [0, 1], [0, 1]);

  return (
    <Bg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 72, padding: "60px 100px" }}>
        <div style={{ flex: "0 0 420px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 100,
              padding: "6px 18px",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
                display: "inline-block",
                transform: `scale(${dotScale})`,
              }}
            />
            <span style={{ color: "#ef4444", fontSize: 18, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              Realtime
            </span>
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#f8fafc", marginBottom: 12, lineHeight: 1.2 }}>
            Alerts appear live.
            <br />No refresh needed.
          </div>
          <div style={{ fontSize: 22, color: "#64748b", lineHeight: 1.6 }}>
            Supabase Realtime pushes alerts the moment the scan completes. Claude filtered 15+ sources down to what matters for your specific medication list.
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: 1100 }}>
          <ScreenshotFrame src="screenshots/Screenshot 2026-05-31 at 00.54.59.png" delay={0} />
        </div>
      </div>
    </Bg>
  );
};

export const SceneDemoDetail: React.FC = () => (
  <Bg>
    <DemoSlide
      badge="Whoa moment"
      label="Real FDA recall. Real lot numbers."
      sub={"Atorvastatin Class II Recall — Ascend Laboratories.\n141,000+ bottles. Dissolution failure.\nMatched automatically to this patient's Lipitor."}
      imgSrc="screenshots/Screenshot 2026-05-31 at 00.56.36.png"
    />
  </Bg>
);

export const SceneDemoChat: React.FC = () => (
  <Bg>
    <DemoSlide
      badge="AI Chat"
      label="Ask anything about your medications."
      sub={"Claude streams a plain-language answer\nwith live Nimble sources — not from a\nstatic database."}
      imgSrc="screenshots/Screenshot 2026-05-31 at 00.57.14.png"
    />
  </Bg>
);

export const SceneDemoCaregiver: React.FC = () => (
  <Bg>
    <DemoSlide
      badge="Caregiver Access"
      label="Share with family. No account needed."
      sub={"One magic link. Read-only view.\nEmail delivered in seconds.\n53M unpaid caregivers finally have a tool."}
      imgSrc="screenshots/Screenshot 2026-05-31 at 00.58.37.png"
    />
  </Bg>
);
