import axios from 'axios';
import type { Badge } from "../../interface/interfaces";

const api = axios.create({
  baseURL: '/api',
});

// Récupérer tous les badges
export async function fetchBadges(): Promise<Badge[]> {
  try {
    const response = await api.get('/badges');
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des badges');
  }
}

// Créer un badge
export async function createBadge(badge: Partial<Badge>) {
  try {
    const response = await api.post('/badges', badge);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la création du badge');
  }
}

// Mettre à jour un badge
export async function updateBadge(id: number, badge: Partial<Badge>) {
  try {
    const response = await api.patch(`/badges/${id}`, badge);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la modification du badge');
  }
}

// Supprimer un badge
export async function deleteBadge(id: number) {
  try {
    const response = await api.delete(`/badges/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la suppression du badge');
  }
}