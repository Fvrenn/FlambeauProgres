import type { StatutJustification, TypeObjectif } from "@prisma/client";

export const LONGUEUR_MAX_CONTENU = 5000;

export const STATUTS_VALIDES: StatutJustification[] = [
  "AUTO_VALIDEE",
  "VALIDEE",
];

export type ObjectifValide = { chefId: string; type: TypeObjectif };

export type TotalObjectifs = { competences: number; realisations: number };

export function chefsAyantToutValide(
  validations: ObjectifValide[],
  total: TotalObjectifs,
): string[] {
  const parChef = new Map<string, TotalObjectifs>();

  for (const { chefId, type } of validations) {
    const compte = parChef.get(chefId) ?? { competences: 0, realisations: 0 };

    if (type === "COMPETENCE") {
      compte.competences += 1;
    } else {
      compte.realisations += 1;
    }

    parChef.set(chefId, compte);
  }

  return [...parChef.entries()]
    .filter(
      ([, compte]) =>
        compte.competences === total.competences &&
        compte.realisations === total.realisations,
    )
    .map(([chefId]) => chefId);
}
