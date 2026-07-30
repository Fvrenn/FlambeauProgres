import React from "react";

export function RoleMenu({ role="Admin", context="Mon Progrès (Chef)" }) {
  return (
    <div style={{
      width:239,height:54,borderRadius:"var(--radius-sm)",position:"relative",
      background:"var(--surface-muted)",boxShadow:"var(--shadow-inset-border)",
      padding:"9px 12px",boxSizing:"border-box",display:"flex",flexDirection:"column",justifyContent:"center",gap:0,
    }}>
      <span style={{fontFamily:"var(--font-sans)",fontSize:"var(--text-label)",lineHeight:"var(--leading-label)",fontWeight:"var(--weight-label-medium)",color:"var(--text-primary)"}}>{role}</span>
      <span style={{fontFamily:"var(--font-sans)",fontSize:"var(--text-caption)",lineHeight:"var(--leading-caption)",color:"var(--text-muted)"}}>{context}</span>
      <span aria-hidden style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:3}}>
        <span style={{width:8,height:2,background:"#A1A1AA",borderRadius:1}} />
        <span style={{width:8,height:2,background:"#A1A1AA",borderRadius:1}} />
      </span>
    </div>
  );
}
