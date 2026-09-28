import type { StatutJustification } from "@prisma/client";

export const LONGUEUR_MAX_CONTENU = 5000;

export const STATUTS_VALIDES: StatutJustification[] = [
  "AUTO_VALIDEE",
  "VALIDEE",
];
