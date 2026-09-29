import type { StatutJustification, TypeObjectif } from "@prisma/client";

import { competenceSoumiseAEvaluation } from "@/lib/roles";

export const LONGUEUR_MAX_CONTENU = 5000;

export const MESSAGE_DOSSIER_INCOMPLET =
  "Toutes les compétences et réalisations doivent être validées avant de valider l'étape";

export const MESSAGE_AUTO_VALIDATION =
  "Vous ne pouvez pas valider votre propre étape";

export const STATUTS_VALIDES: StatutJustification[] = [
  "AUTO_VALIDEE",
  "VALIDEE",
];

export const LIBELLE_TYPE_OBJECTIF: Record<TypeObjectif, string> = {
  COMPETENCE: "compétence",
  REALISATION: "réalisation",
};

export const TITRE_VALIDATION: Record<TypeObjectif, string> = {
  COMPETENCE: "Compétence validée",
  REALISATION: "Réalisation validée",
};

export function statutValidant(
  type: TypeObjectif,
  niveau: number,
): StatutJustification {
  return type === "COMPETENCE" && !competenceSoumiseAEvaluation(niveau)
    ? "AUTO_VALIDEE"
    : "VALIDEE";
}

export function filtreJustificationsValidantes(niveau: number) {
  return {
    OR: [
      {
        statut: statutValidant("COMPETENCE", niveau),
        objectif: { type: "COMPETENCE" as const },
      },
      {
        statut: statutValidant("REALISATION", niveau),
        objectif: { type: "REALISATION" as const },
      },
    ],
  };
}

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

export function compterParType(
  totaux: { type: TypeObjectif; _count: { id: number } }[],
  type: TypeObjectif,
): number {
  return totaux.find((total) => total.type === type)?._count.id ?? 0;
}
