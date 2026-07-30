import React from "react";

const TONES = {
  neutral: { bg:"var(--surface-muted)", fg:"var(--text-primary)" },
  brand: { bg:"var(--color-orange-600)", fg:"#fff" },
  gold: { bg:"var(--color-gold-400)", fg:"var(--text-primary)" },
  violet: { bg:"var(--color-violet-500)", fg:"#fff" },
};

export function Tag({ children, tone="neutral" }) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",height:22,padding:"0 10px",
      borderRadius:"var(--radius-full)",background:t.bg,color:t.fg,
      fontFamily:"var(--font-sans)",fontSize:"var(--text-caption)",lineHeight:"var(--leading-caption)",
      fontWeight:"var(--weight-label-medium)",whiteSpace:"nowrap",
    }}>{children}</span>
  );
}
