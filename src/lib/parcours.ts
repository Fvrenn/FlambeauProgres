export type JalonNiveau = { id: string; niveau: number };

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
