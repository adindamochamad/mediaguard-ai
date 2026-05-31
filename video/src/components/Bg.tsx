import React from "react";

export const Bg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 1920,
      height: 1080,
      background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020c1b 100%)",
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      overflow: "hidden",
      position: "relative",
    }}
  >
    {/* Subtle grid overlay */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(13,148,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.04) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    />
    {children}
  </div>
);
