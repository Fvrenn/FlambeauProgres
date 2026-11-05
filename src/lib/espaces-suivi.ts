export type EspaceSuivi = "referent" | "commission" | "coordination";

const ACCUEILS: Record<EspaceSuivi, string> = {
  referent: "/referent/dashboard",
  commission: "/commission/evaluations",
  coordination: "/coordination/validations",
};

const DOSSIERS: Record<EspaceSuivi, string> = {
  referent: "/referent/revision",
  commission: "/commission/dossier",
  coordination: "/coordination/dossier",
};

export function lienDiscussion(
  espace: EspaceSuivi,
  etapeId: string,
  justificationId: string,
): string {
  const params = new URLSearchParams(
    espace === "referent"
      ? { etapeId, justification: justificationId }
      : { justification: justificationId },
  );

  return `${ACCUEILS[espace]}?${params.toString()}`;
}

export function lienDossier(
  espace: EspaceSuivi,
  chefId: string,
  etapeId: string,
): string {
  const params = new URLSearchParams({ chefId, etapeId });

  return `${DOSSIERS[espace]}?${params.toString()}`;
}

export function lienRetourDossier(
  espace: EspaceSuivi,
  etapeId: string,
): string {
  if (espace !== "referent") {
    return ACCUEILS[espace];
  }

  const params = new URLSearchParams({ etapeId, tab: "a-reviser" });

  return `${ACCUEILS[espace]}?${params.toString()}`;
}
