export type Justification = {
  id?: string;
  chefId: string;
  objectifId: string;
  badgeId: string;
  activiteDescription: string;
  dateActivite?: string; // ou Date si tu utilises des objets Date côté front
  dureeHeures?: number;
  contexte?: string;
  nombreJeunes?: number;
  trancheAge?: string;
  niveau?: string;
  objectifsAtteints?: string;
  statut?: string; // StatutJustification (BROUILLON, SOUMISE, etc.)
  version?: number;
  soumiseAt?: string;
  valideeAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // fichiers?: Fichier[]; // à ajouter si tu veux typer les fichiers liés
  // commentaires?: Commentaire[]; // idem pour les commentaires
};