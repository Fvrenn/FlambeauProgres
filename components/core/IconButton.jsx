import React from "react";

export function IconButton({ children, active=false, size=40, onClick, "aria-label":ariaLabel }) {
  return (
    <button aria-label={ariaLabel} onClick={onClick} style={{
      width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center",
      borderRadius:"var(--radius-sm)",border:"none",cursor:"pointer",
      background: active ? "var(--surface-inverse)" : "var(--surface-muted)",
      color: active ? "var(--text-on-inverse)" : "var(--text-primary)",
      transition:"background var(--duration-fast) var(--ease-standard)",
    }}>{children}</button>
  );
}
