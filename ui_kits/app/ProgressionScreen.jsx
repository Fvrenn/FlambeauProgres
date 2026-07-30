const { useState } = React;

const BADGES = Array.from({length:12}, (_,i)=>`../../assets/badges/badge-${String(i+1).padStart(2,"0")}.png`);

const COMPETENCIES = [
  { code:"B1", text:"Acquérir et savoir utiliser le \"Guide du Bois\" (p. 9 à 11)", status:"Non fait" },
  { code:"B2", text:"Se repérer dans le carnet et savoir expliquer l'ordre et le principe des différentes parties de chaque volume.", status:"Non fait" },
  { code:"B3", text:"Lire le chapitre \"L'enfant à l'âge PF\" p.19 du Guide du Bois et animer une discussion.", status:"Non fait" },
  { code:"B4", text:"Observer les jeunes de ta sizaine, noter pour chacun d'eux les domaines dans lesquels il peut progresser.", status:"Validé", tone:"done" },
  { code:"B5", text:"Connaître les grandes lignes de l'histoire des ABQS, le rôle des 5 personnages principaux.", status:"Non fait" },
  { code:"B6", text:"Expliquer aux jeunes le sens des différents rituels (rassemblement, Grand Arbre...) et connaître la place des différents marqueurs sur l'uniforme.", status:"Non fait" },
  { code:"B7", text:"Accompagner un ami du Bois dans toute la démarche de la Parole de PF.", status:"Non fait" },
];

function ProgressionScreen() {
  const { SidebarNav, RoleMenu, SegmentedTabs, BadgeSelector, CompetencyItem } = window.FlambeauProgrSDesignSystem_0e4b04;
  const [selectedBadge, setSelectedBadge] = useState(0);

  return (
    <div style={{width:1920,minHeight:859,background:"var(--surface-page)",display:"flex",fontFamily:"var(--font-sans)"}}>
      <div style={{width:288,borderRight:"1px solid var(--border-default)",padding:"24px 24px 0",flexShrink:0}}>
        <img src="../../assets/logo-flambeau-progres.svg" style={{width:50,height:68}} />
        <div style={{position:"absolute",marginTop:-59,marginLeft:66,fontWeight:500,fontSize:24,lineHeight:"28px",color:"var(--text-brand)",whiteSpace:"pre"}}>{"Flambeau\nProgrès"}</div>
        <div style={{marginTop:32}}><RoleMenu role="Admin" context="Mon Progrès (Chef)" /></div>
        <div style={{marginTop:24}}>
          <SidebarNav items={[{label:"Tableau de bord"},{label:"Progression"},{label:"Formation"}]} defaultIndex={1} />
        </div>
      </div>

      <div style={{flex:1,padding:"16px 24px",overflow:"hidden"}}>
        <h1 style={{margin:"0 0 20px",fontWeight:400,fontSize:30,lineHeight:"36px",color:"var(--text-primary)"}}>Tableau de bord</h1>
        <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
          <div style={{width:345,borderRadius:"var(--radius-lg)",background:"var(--surface-sunken)",padding:2,flexShrink:0}}>
            <img src="../../assets/badges/hero-scouts.png" style={{width:341,height:"auto",display:"block",borderRadius:"22px 22px 0 0"}} />
            <div style={{background:"var(--surface-muted)",boxShadow:"var(--shadow-inset-border)",borderRadius:"0 0 22px 22px",padding:29,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,justifyItems:"center"}}>
              {BADGES.map((b,i)=>(
                <BadgeSelector key={i} image={b} label={String(i)} selected={i===selectedBadge} onClick={()=>setSelectedBadge(i)} />
              ))}
            </div>
          </div>

          <div style={{flex:1}}>
            <SegmentedTabs tabs={["Objectif","Notifications"]} variant="inverse" />
            <div style={{marginTop:16,background:"var(--surface-card)",borderRadius:"var(--radius-lg)",padding:24}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <h2 style={{margin:0,fontWeight:700,fontSize:20,lineHeight:"28px"}}>Étape Branche Petits Flambeaux</h2>
                <img src="../../assets/badges/badge-01.png" style={{width:24}} />
              </div>
              <SegmentedTabs tabs={["Compétences","Réalisations"]} variant="light" />
              <div style={{marginTop:24,borderTop:"1px solid var(--border-default)"}}>
                {COMPETENCIES.map((c,i)=>(
                  <CompetencyItem key={c.code} {...c} last={i===COMPETENCIES.length-1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.ProgressionScreen = ProgressionScreen;
