export type JalonNiveau = { id: string; niveau: number };

export type EtapeParcours = { id: string; niveau: number; type: string };

export const NIVEAU_SPECIALITES = 2;
export const NIVEAU_PROFILS = 3;

export function niveauMaxDebloque(
  jalons: JalonNiveau[],
  etapesValidees: Set<string>,
): number {
  const bloquants = jalons
    .filter((jalon) => !etapesValidees.has(jalon.id))
    .map((jalon) => jalon.niveau);

  return bloquants.length === 0
    ? Number.POSITIVE_INFINITY
    : Math.min(...bloquants);
}

export function jalonsImplicites(
  etapesDeclarees: JalonNiveau[],
  jalons: JalonNiveau[],
): string[] {
  if (etapesDeclarees.length === 0) {
    return [];
  }

  const niveauMaxDeclare = Math.max(
    ...etapesDeclarees.map((etape) => etape.niveau),
  );
  const declarees = new Set(etapesDeclarees.map((etape) => etape.id));

  return jalons
    .filter(
      (jalon) => jalon.niveau < niveauMaxDeclare && !declarees.has(jalon.id),
    )
    .map((jalon) => jalon.id);
}

export function etapeEstDebloquee(
  niveauEtape: number,
  niveauMax: number,
): boolean {
  return niveauEtape <= niveauMax;
}

export function auMoinsUneSpecialiteValidee(
  etapes: EtapeParcours[],
  etapesValidees: Set<string>,
): boolean {
  return etapes.some(
    (etape) =>
      etape.niveau === NIVEAU_SPECIALITES &&
      etape.type === "BADGE" &&
      etapesValidees.has(etape.id),
  );
}

export function etapeEstAccessible(
  etape: EtapeParcours,
  niveauMax: number,
  specialiteValidee: boolean,
  etapesValidees: Set<string>,
): boolean {
  if (etapesValidees.has(etape.id)) {
    return true;
  }

  if (!etapeEstDebloquee(etape.niveau, niveauMax)) {
    return false;
  }

  return etape.niveau < NIVEAU_PROFILS || specialiteValidee;
}
