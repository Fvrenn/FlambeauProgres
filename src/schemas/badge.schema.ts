import { z } from "zod";

export const BadgeSchema = z.object({
  number: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  image_src: z.string(),
  ordre: z.number().int().positive(),
  objectifs: z.array(
    z.object({
      code: z.string().min(1),
      description: z.string(),
      type: z.enum(["COMPETENCE", "REALISATION"]),
    })
  ),
});

export const UpdateBadgeSchema = BadgeSchema.partial();