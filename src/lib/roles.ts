import type { UserRole } from "@prisma/client";

export const NIVEAU_ETAPE_3 = 3;

export const ROLES_ADMIN: UserRole[] = [
  "ADMIN",
  "COMMISSION_FORMATION",
  "COORDINATEUR_NATIONAL",
];

export const ROLES_REFERENT: UserRole[] = ["REFERENT", ...ROLES_ADMIN];

export const roleColorMap: Record<
  UserRole,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  CHEF: "default",
  REFERENT: "secondary",
  ADMIN: "danger",
  COMMISSION_FORMATION: "warning",
  COORDINATEUR_NATIONAL: "primary",
};

export const roleLabelMap: Record<UserRole, string> = {
  CHEF: "Chef",
  REFERENT: "Référent",
  ADMIN: "Administrateur",
  COMMISSION_FORMATION: "Commission Formation",
  COORDINATEUR_NATIONAL: "Coordinateur National",
};

export function estAdmin(role: UserRole | null | undefined): boolean {
  return Boolean(role && ROLES_ADMIN.includes(role));
}

export function estReferent(role: UserRole | null | undefined): boolean {
  return Boolean(role && ROLES_REFERENT.includes(role));
}

export function estNiveauEtape3(niveau: number): boolean {
  return niveau >= NIVEAU_ETAPE_3;
}

export function suitEtapeSansAssignation(
  role: UserRole | null | undefined,
  niveau: number,
): boolean {
  return (
    estNiveauEtape3(niveau) &&
    (role === "COMMISSION_FORMATION" || role === "COORDINATEUR_NATIONAL")
  );
}

export function peutEvaluerEtape(
  role: UserRole | null | undefined,
  niveau: number,
  estAssigne: boolean,
): boolean {
  if (estNiveauEtape3(niveau)) {
    return role === "COMMISSION_FORMATION";
  }

  return estReferent(role) && estAssigne;
}

export function peutValiderEtape(
  role: UserRole | null | undefined,
  niveau: number,
  estAssigne: boolean,
): boolean {
  if (estNiveauEtape3(niveau)) {
    return role === "COORDINATEUR_NATIONAL";
  }

  return estReferent(role) && estAssigne;
}

export const FILTRE_ETAPES_PAR_ASSIGNATION = {
  type: "BADGE",
  niveau: { lt: NIVEAU_ETAPE_3 },
} as const;

export function etapeSeGereParAssignation(etape: {
  type: string;
  niveau: number;
}): boolean {
  return etape.type === "BADGE" && !estNiveauEtape3(etape.niveau);
}

export function competenceSoumiseAEvaluation(niveau: number): boolean {
  return estNiveauEtape3(niveau);
}

export function messageRefusEvaluation(niveau: number): string {
  return estNiveauEtape3(niveau)
    ? "Seule la commission Formation évalue les compétences et réalisations de l'étape 3"
    : "Vous n'êtes pas référent de cette étape";
}

export function messageRefusValidation(niveau: number): string {
  return estNiveauEtape3(niveau)
    ? "Seul le Coordinateur National valide l'étape 3"
    : "Vous n'êtes pas référent de cette étape";
}
