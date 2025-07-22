import { z } from "zod";

export const badgeSchema = z.object({
  number: z.string(),
  name: z.string(),
  description: z.string(),
  image_src: z.string().optional(),
  couleur: z.string().optional(),
  ordre: z.number(),
  actif: z.boolean().optional(),
});