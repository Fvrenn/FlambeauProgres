import React from "react";

const HEX = "M35.175 0 L70.35 20.212 L70.35 60.638 L35.175 80.85 L0 60.638 L0 20.212 Z";

export function BadgeSelector({ image, selected=false, onClick, label }) {
  return (
    <button onClick={onClick} aria-label={label} aria-pressed={selected} style={{
      width:70.35,height:80.85,border:"none",cursor:"pointer",background:"transparent",padding:0,position:"relative",
    }}>
      <svg width="100%" height="100%" viewBox="0 0 70.35 80.85" style={{position:"absolute",inset:0}}>
        <clipPath id={"hex-"+label}><path d={HEX} /></clipPath>
        <image href={image} width="70.35" height="80.85" preserveAspectRatio="xMidYMid slice" clipPath={`url(#hex-${label})`} />
        <path d={HEX} fill="none" stroke={selected ? "var(--color-gold-400)" : "transparent"} strokeWidth="3" />
      </svg>
    </button>
  );
}
