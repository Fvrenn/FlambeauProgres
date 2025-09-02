export interface DemandePrecision {
  id: string;
  justificationId: string;
  referentId: string;
  champ: string; // "dureeHeures", "contexte", "nombreJeunes", etc.
  message: string;
  resolue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDemandePrecisionRequest {
  justificationId: string;
  referentId: string;
  champ: string;
  message: string;
}