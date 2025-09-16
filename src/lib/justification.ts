import type { Justification } from "@/src/types/justification";

export async function saveJustification(justification: Omit<Justification, "id" | "statut">) {
  const res = await fetch("/api/justification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...justification, statut: "BROUILLON" }),
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Échec de la sauvegarde: ${res.status} - ${errorData}`);
  }
  return await res.json();
}

export async function submitJustification(justification: Omit<Justification, "id" | "statut">) {
  const res = await fetch("/api/justification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...justification, statut: "SOUMISE" }),
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Échec de la soumission: ${res.status} - ${errorData}`);
  }
  return await res.json();
}

export async function updateJustificationStatut(id: string, statut: "BROUILLON" | "SOUMISE") {
  const res = await fetch("/api/justification", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, statut }),
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Échec de la mise à jour du statut: ${res.status} - ${errorData}`);
  }
  return await res.json();
}

// Renommer la fonction pour être plus explicite
export async function getJustification(badgeId: string, objectifId: string, chefId: string) {
  const res = await fetch(
    `/api/justification?badgeId=${badgeId}&objectifId=${objectifId}&chefId=${chefId}`,
    { method: "GET" }
  );
  if (!res.ok) {
    throw new Error("Impossible de charger la justification");
  }
  return await res.json();
}

// Garder l'ancien nom pour la compatibilité
export const getJustificationDraft = getJustification;

export async function updateJustification(justification: any) {
  const res = await fetch("/api/justification", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(justification),
  });
  if (!res.ok) throw new Error("Erreur update justification");
  return await res.json();
}