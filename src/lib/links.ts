import { lienDiscussion, lienDossier } from "@/lib/espaces-suivi";
import { origineApplication } from "@/lib/public-url";
import { estNiveauEtape3 } from "@/lib/roles";

export function chefThreadUrl(justificationId: string): string {
  const params = new URLSearchParams({ justification: justificationId });

  return `${origineApplication()}/?${params.toString()}`;
}

export function evaluateurThreadUrl(
  etape: { id: string; niveau: number },
  justificationId: string,
): string {
  const espace = estNiveauEtape3(etape.niveau) ? "commission" : "referent";

  return `${origineApplication()}${lienDiscussion(espace, etape.id, justificationId)}`;
}

export function dossierAValiderUrl(chefId: string, etapeId: string): string {
  return `${origineApplication()}${lienDossier("coordination", chefId, etapeId)}`;
}
