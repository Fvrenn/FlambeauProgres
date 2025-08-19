import { z } from "zod";

export const JustificationShema = z.object({
  chefId: z.string().min(1, "chefId requis"),
  objectifId: z.string().min(1, "objectifId requis"),
  badgeId: z.string().min(1, "badgeId requis"),
  activiteDescription: z.string().min(1, "Description requise"),
  dateActivite: z.string().datetime().optional().or(z.literal("").transform(() => undefined)),
  dureeHeures: z.number().optional(),
  contexte: z.string().optional(),
  nombreJeunes: z.number().int().optional(),
  trancheAge: z.string().optional(),
  niveau: z.string().optional(),
  objectifsAtteints: z.string().optional(),
});