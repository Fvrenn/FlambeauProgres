import { z } from "zod";

export const JustificationShema = z.object({
  chefId: z.string(),
  objectifId: z.string(),
  badgeId: z.string(),
  activiteDescription: z.string(),
  dateActivite: z.string().optional(),
  dureeHeures: z.number().optional(),
  contexte: z.string().optional(),
  nombreJeunes: z.string().optional(),
  trancheAge: z.string().optional(),
  niveau: z.string().optional(),
  objectifsAtteints: z.string().optional(),
  statut: z.enum(["BROUILLON", "SOUMISE"]),
});

export const JustificationUpdateSchema = z.object({
  id: z.string(),
  statut: z.enum(["BROUILLON", "SOUMISE"]),
});