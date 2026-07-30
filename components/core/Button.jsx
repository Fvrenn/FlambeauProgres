import React from "react";

const SIZES = {
  sm: { h:32, padX:14, fontSize:"var(--text-caption)", lineHeight:"var(--leading-caption)", gap:6 },
  md: { h:40, padX:18, fontSize:"var(--text-label)", lineHeight:"var(--leading-label)", gap:8 },
  lg: { h:48, padX:24, fontSize:"var(--text-body-lg)", lineHeight:"var(--leading-body-lg)", gap:10 },
};

const VARIANTS = {
  primary: { bg:"var(--surface-inverse)", fg:"var(--text-on-inverse)", border:"none" },
  secondary: { bg:"var(--surface-muted)", fg:"var(--text-primary)", border:"none" },
  outline: { bg:"transparent", fg:"var(--text-primary)", border:"1px solid var(--border-default)" },
  ghost: { bg:"transparent", fg:"var(--text-primary)", border:"none" },
  accent: { bg:"var(--surface-highlight)", fg:"var(--text-primary)", border:"none" },
};

export function Button({ children, icon, trailingIcon, kbd, variant="primary", size="md", disabled=false, onClick }) {
  const s = SIZES[size] ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height:s.h,padding:`0 ${s.padX}px`,display:"inline-flex",alignItems:"center",gap:s.gap,
      borderRadius:"var(--radius-full)",background:v.bg,color:v.fg,border:v.border,
      fontFamily:"var(--font-sans)",fontSize:s.fontSize,lineHeight:s.lineHeight,fontWeight:"var(--weight-label-medium)",
      cursor: disabled ? "default" : "pointer",opacity: disabled ? .45 : 1,whiteSpace:"nowrap",
      transition:"background var(--duration-fast) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard)",
    }}>
      {icon && <span aria-hidden style={{display:"flex",width:16,height:16,alignItems:"center",justifyContent:"center"}}>{icon}</span>}
      {children}
      {trailingIcon && <span aria-hidden style={{display:"flex",width:16,height:16,alignItems:"center",justifyContent:"center"}}>{trailingIcon}</span>}
      {kbd && <span aria-hidden style={{
        marginLeft:2,fontSize:11,lineHeight:"16px",padding:"0 6px",borderRadius:"var(--radius-full)",
        background:"rgba(255,255,255,.18)",color:"inherit",
      }}>{kbd}</span>}
    </button>
  );
}
