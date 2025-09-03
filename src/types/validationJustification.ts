export interface ValidateJustificationRequest {
  justificationId: string;
  action: "VALIDER" | "REFUSER";
  commentaire?: string;
}

export interface ValidateJustificationResponse {
  success: boolean;
  justification: {
    id: string;
    statut: string;
  };
}