import { z } from "zod";

const competenceSchema = z.object({
  description: z.string().min(1, "La description de la compétence est requise"),
});

export const badgeSchema = z.object({
  number: z.string(),
  name: z.string(),
  description: z.string(),
  image_src: z.string(),
  ordre: z.number(),
  actif: z.boolean(),
  competences: z.array(competenceSchema).default([]),
});

export type BadgeCreateInput = z.infer<typeof badgeSchema>;