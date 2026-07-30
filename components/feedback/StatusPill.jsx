import React from "react";

const TONES = {
  neutral: { bg:"rgba(232,231,222,.4)", fg:"var(--text-accent-violet)" },
  done: { bg:"var(--surface-highlight)", fg:"var(--text-primary)" },
};

export function StatusPill({ children="Non fait", tone="neutral" }) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",height:24,padding:"0 10px",
      borderRadius:"var(--radius-full)",background:t.bg,color:t.fg,
      fontFamily:"var(--font-sans)",fontSize:"var(--text-caption)",lineHeight:"var(--leading-caption)",whiteSpace:"nowrap",
    }}>{children}</span>
  );
}
