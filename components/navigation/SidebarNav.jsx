import React, { useState } from "react";

export function SidebarNav({ items, defaultIndex=1 }) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:2,width:239}}>
      {items.map((item,i)=>{
        const isActive = i===active;
        return (
          <button key={item.label} onClick={()=>setActive(i)} style={{
            display:"flex",alignItems:"center",gap:20,textAlign:"left",
            border:"none",cursor:"pointer",width:"100%",height:44,
            padding:"10px 12px",borderRadius:"var(--radius-md)",
            background: isActive ? "var(--surface-muted)" : "transparent",
            fontFamily:"var(--font-sans)",fontSize:"var(--text-label)",lineHeight:"var(--leading-label)",
            fontWeight:"var(--weight-label-medium)",color:"var(--text-primary)",
          }}>
            <span style={{width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center"}}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
