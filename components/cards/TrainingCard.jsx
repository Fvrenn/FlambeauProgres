import React from "react";

export function TrainingCard({ image, category, title, description, duration, href="#", external=true }) {
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} style={{
      display:"flex",flexDirection:"column",width:280,textDecoration:"none",color:"inherit",
      borderRadius:"var(--radius-lg)",background:"var(--surface-card)",overflow:"hidden",
      boxShadow:"var(--shadow-inset-border)",
    }}>
      <div style={{width:"100%",height:150,background:"var(--surface-sunken)",overflow:"hidden"}}>
        {image && <img src={image} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />}
      </div>
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:8,flex:1}}>
        {category && <span style={{fontFamily:"var(--font-sans)",fontSize:"var(--text-caption)",lineHeight:"var(--leading-caption)",fontWeight:"var(--weight-label-semibold)",color:"var(--text-brand)",textTransform:"uppercase",letterSpacing:.4}}>{category}</span>}
        <h3 style={{margin:0,fontFamily:"var(--font-sans)",fontSize:"var(--text-h2)",lineHeight:"var(--leading-h2)",fontWeight:"var(--weight-h2)",color:"var(--text-primary)"}}>{title}</h3>
        {description && <p style={{margin:0,fontFamily:"var(--font-sans)",fontSize:"var(--text-label)",lineHeight:"var(--leading-label)",color:"var(--text-muted)",flex:1}}>{description}</p>}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
          {duration && <span style={{fontFamily:"var(--font-sans)",fontSize:"var(--text-caption)",lineHeight:"var(--leading-caption)",color:"var(--text-muted)"}}>{duration}</span>}
          <span aria-hidden style={{fontFamily:"var(--font-sans)",fontSize:"var(--text-label)",color:"var(--text-primary)"}}>↗</span>
        </div>
      </div>
    </a>
  );
}
