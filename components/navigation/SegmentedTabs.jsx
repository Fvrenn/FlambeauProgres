import React, { useState } from "react";

export function SegmentedTabs({ tabs, defaultIndex=0, variant="inverse" }) {
  const [active, setActive] = useState(defaultIndex);
  const inverse = variant === "inverse";
  return (
    <div style={{
      display:"inline-flex",gap:0,padding:2,borderRadius:"var(--radius-full)",
      background: inverse ? "var(--surface-inverse)" : "var(--surface-page)",
      borderBottom: inverse ? "1px solid rgba(17,17,17,.15)" : "none",
    }}>
      {tabs.map((t,i)=>{
        const isActive = i===active;
        return (
          <button key={t} onClick={()=>setActive(i)} style={{
            border:"none",cursor:"pointer",borderRadius:"var(--radius-full)",
            padding:"14px 24px",
            fontFamily:"var(--font-sans)",fontSize:"var(--text-label)",lineHeight:"var(--leading-label)",
            fontWeight: isActive ? "var(--weight-label-semibold)" : "var(--weight-label-regular)",
            background: isActive ? (inverse ? "var(--surface-card)" : "var(--surface-highlight)") : "transparent",
            boxShadow: isActive ? "var(--shadow-pill)" : "none",
            color: isActive ? "var(--text-primary)" : (inverse ? "var(--text-on-inverse)" : "var(--text-primary)"),
            transition:"background var(--duration-fast) var(--ease-standard)",
          }}>{t}</button>
        );
      })}
    </div>
  );
}
