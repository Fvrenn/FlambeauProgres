import { z } from "zod";

const competenceInputSchema = z.object({
  description: z.string().min(1, "La description de la compétence est requise"),
});

// Schéma pour une option de réalisation
const realisationOptionSchema = z.object({
  description: z.string().min(1, "La description de l'option est requise"),
});

// Schéma pour un bloc de réalisations
const realisationBlockSchema = z.object({
  description: z.string().min(1, "La description du bloc est requise"),
  requiredCount: z.number().int().positive().optional().default(1), // Nombre requis, par défaut 1
  options: z.array(realisationOptionSchema).min(1, "Au moins une option est requise"),
});

export const badgeSchema = z.object({
  number: z.string(),
  name: z.string(),
  description: z.string(),
  image_src: z.string(),
  couleur: z.string().optional(),
  ordre: z.number(),
  actif: z.boolean().optional(),

  competences: z.array(competenceInputSchema).optional().default([]),
  realisations: z.array(realisationBlockSchema).optional().default([]),
});

export type BadgeCreateInput = z.infer<typeof badgeSchema>;