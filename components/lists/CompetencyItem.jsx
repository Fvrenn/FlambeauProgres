import React from "react";
import { StatusPill } from "../feedback/StatusPill.jsx";
import { IconButton } from "../core/IconButton.jsx";

export function CompetencyItem({ code="B1", text, status="Non fait", tone="neutral", last=false }) {
  return (
    <div style={{position:"relative",width:"100%",padding:"26px 20px",display:"flex",alignItems:"center",gap:30,
      borderBottom: last ? "none" : "1px solid var(--border-default)"}}>
      <div style={{width:48,height:48,borderRadius:"var(--radius-full)",boxShadow:"inset 0 0 0 1px #E9E9E9",
        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
        fontFamily:"var(--font-sans)",fontSize:20,color:"var(--text-primary)"}}>{code}</div>
      <p style={{flex:1,margin:0,fontFamily:"var(--font-sans)",fontSize:"var(--text-body-lg)",lineHeight:"var(--leading-body-lg)",color:"var(--text-primary)"}}>{text}</p>
      <StatusPill tone={tone}>{status}</StatusPill>
      <IconButton aria-label="Ouvrir la compétence">›</IconButton>
    </div>
  );
}
