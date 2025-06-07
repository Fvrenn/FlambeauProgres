import type { Badge } from "../../interface/interfaces";

// Types pour les badges de l'API
export interface ApiBadge {
  id: number;
  name: string;
  number?: string;
  description?: string;
  image_src?: string;
  competences: {
    id: number;
    description: string;
  }[];
  realisations: {
    id: number;
    description: string;
  }[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CHEF' | 'REFERENT';
}

// Récupérer tous les badges
export async function fetchBadges(): Promise<Badge[]> {
  const res = await fetch("/api/badges");
  if (!res.ok) throw new Error("Erreur lors du chargement des badges");
  return res.json();
}

// Récupérer tous les badges avec leur structure complète
export async function fetchBadgesComplete(): Promise<ApiBadge[]> {
  const res = await fetch("/api/badges");
  if (!res.ok) throw new Error("Erreur lors du chargement des badges");
  return res.json();
}

// Récupérer tous les utilisateurs
export async function fetchUsers(): Promise<User[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch("/api/users", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
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

// Récupérer les progressions de l'utilisateur connecté
export async function fetchUserProgress(): Promise<Record<number, { isCompleted: boolean; completedAt: Date | null }>> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch("/api/competences/progress", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des progressions");
  return res.json();
}

// Récupérer les progressions d'un utilisateur spécifique
export async function fetchUserProgressById(userId: number): Promise<Record<number, { isCompleted: boolean; completedAt: Date | null }>> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch(`/api/users/${userId}/progress`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des progressions de l'utilisateur");
  return res.json();
}

// Sauvegarder une progression de compétence
export async function saveCompetenceProgress(competenceId: number, isCompleted: boolean) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch("/api/competences/progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ competenceId, isCompleted }),
  });
  if (!res.ok) throw new Error("Erreur lors de la sauvegarde de la progression");
  return res.json();
}

// Valider un badge pour un utilisateur
export async function validateBadge(userId: number, badgeId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch(`/api/users/${userId}/badges/${badgeId}/validate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error("Erreur lors de la validation du badge");
  return res.json();
}

// Invalider un badge pour un utilisateur
export async function invalidateBadge(userId: number, badgeId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch(`/api/users/${userId}/badges/${badgeId}/validate`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error("Erreur lors de l'invalidation du badge");
  return res.json();
}

// Valider une compétence pour un utilisateur
export async function validateCompetence(userId: number, competenceId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch(`/api/users/${userId}/competences/${competenceId}/validate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error("Erreur lors de la validation de la compétence");
  return res.json();
}

// Invalider une compétence pour un utilisateur
export async function invalidateCompetence(userId: number, competenceId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch(`/api/users/${userId}/competences/${competenceId}/validate`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error("Erreur lors de l'invalidation de la compétence");
  return res.json();
}