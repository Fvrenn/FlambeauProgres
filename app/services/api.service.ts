import type { Badge } from "../../interface/interfaces";

// Récupérer tous les badges
export async function fetchBadges(): Promise<Badge[]> {
  const res = await fetch("/api/badges");
  if (!res.ok) throw new Error("Erreur lors du chargement des badges");
  return res.json();
}

// Créer un badge
export async function createBadge(badge: Partial<Badge>) {
  const res = await fetch("/api/badges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(badge),
  });
  if (!res.ok) throw new Error("Erreur lors de la création du badge");
  return res.json();
}

// Mettre à jour un badge
export async function updateBadge(id: number, badge: Partial<Badge>) {
  const res = await fetch(`/api/badges/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(badge),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification du badge");
  return res.json();
}

// Supprimer un badge
export async function deleteBadge(id: number) {
  const res = await fetch(`/api/badges/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du badge");
  return res.json();
}