export const formatteurJour = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const SEUIL_ATTENTE_LONGUE_JOURS = 30;

export function libelleAnciennete(jours: number | null): string {
  if (jours === null) {
    return "—";
  }

  return jours === 0 ? "Aujourd'hui" : `${jours} j`;
}
