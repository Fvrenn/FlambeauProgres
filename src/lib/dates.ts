const MS_PAR_HEURE = 60 * 60 * 1000;
const HEURES_PAR_JOUR = 24;

const tempsRelatif = new Intl.RelativeTimeFormat("fr", { numeric: "always" });

export function formaterAnciennete(
  depuis: Date,
  maintenant: Date = new Date(),
): string {
  const heures = Math.floor(
    (maintenant.getTime() - depuis.getTime()) / MS_PAR_HEURE,
  );

  if (heures < 1) {
    return "il y a moins d'une heure";
  }

  if (heures < HEURES_PAR_JOUR) {
    return tempsRelatif.format(-heures, "hour");
  }

  return tempsRelatif.format(-Math.floor(heures / HEURES_PAR_JOUR), "day");
}
