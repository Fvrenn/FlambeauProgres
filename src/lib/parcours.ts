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

export function etapeEstDebloquee(
  niveauEtape: number,
  niveauMax: number,
): boolean {
  return niveauEtape <= niveauMax;
}
