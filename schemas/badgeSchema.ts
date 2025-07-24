// schemas/badgeSchema.ts
import { z } from "zod";

// Schéma pour une compétence (inchangé)
const competenceSchema = z.object({
  description: z.string().min(1, "La description de la compétence est requise"),
});

// NOUVEAUX SCHÉMAS pour les réalisations
const realisationSchema = z.object({
  description: z.string().min(1, "La description de la réalisation est requise"),
});

// Schéma principal étendu
export const badgeSchema = z.object({
  number: z.string(),
  name: z.string(),
  description: z.string(),
  image_src: z.string(),
  ordre: z.number(),
  actif: z.boolean(),
  competences: z.array(competenceSchema).default([]),
  realisations: z.array(realisationSchema).default([]),
});

export type BadgeCreateInput = z.infer<typeof badgeSchema>;