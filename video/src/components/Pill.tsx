import React from "react";

type Severity = "critical" | "warning" | "info";

const COLORS: Record<Severity, { bg: string; text: string }> = {
  critical: { bg: "#fef2f2", text: "#991b1b" },
  warning:  { bg: "#fffbeb", text: "#92400e" },
  info:     { bg: "#eff6ff", text: "#1e40af" },
};

export const Pill: React.FC<{ severity: Severity }> = ({ severity }) => {
  const c = COLORS[severity];
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        padding: "6px 16px",
        borderRadius: 8,
        display: "inline-block",
      }}
    >
      {severity}
    </span>
  );
};
