import React from "react";

export function ProgressBar({ value=0, max=100, label, showValue=true }) {
  const pct = Math.max(0, Math.min(100, (value/max)*100));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
      {(label || showValue) && (
        <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-sans)",fontSize:"var(--text-caption)",lineHeight:"var(--leading-caption)",color:"var(--text-muted)"}}>
          <span>{label}</span>
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{width:"100%",height:8,borderRadius:"var(--radius-full)",background:"var(--surface-muted)",overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",borderRadius:"var(--radius-full)",background:"var(--color-gold-400)",transition:"width var(--duration-base) var(--ease-standard)"}} />
      </div>
    </div>
  );
}
