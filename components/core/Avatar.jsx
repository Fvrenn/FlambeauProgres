import React from "react";

const SIZES = { sm:28, md:40, lg:56 };

export function Avatar({ src, initials, size="md", ring=false }) {
  const s = SIZES[size] ?? SIZES.md;
  return (
    <div style={{
      width:s,height:s,borderRadius:"var(--radius-full)",flexShrink:0,
      background: src ? "transparent" : "var(--surface-inverse)",
      color:"var(--text-on-inverse)",display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"var(--font-sans)",fontSize:s*0.38,fontWeight:"var(--weight-label-semibold)",
      overflow:"hidden",boxShadow: ring ? "0 0 0 2px var(--color-gold-400)" : "none",
    }}>
      {src ? <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : initials}
    </div>
  );
}
