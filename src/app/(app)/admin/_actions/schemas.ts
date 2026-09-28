import { z } from "zod";

import { REGLES_ICONE_ETAPE, validerFichier } from "@/lib/fichiers";

export const idSchema = z.string().min(1);

export const objectifInputSchema = z.object({
  code: z.string().min(1).max(50),
  description: z.string().max(2000),
  type: z.enum(["COMPETENCE", "REALISATION"]),
  fichiersRequis: z.boolean(),
  texteRequis: z.boolean(),
});

export const iconeEtapeSchema = z
  .instanceof(File)
  .refine((icone) => validerFichier(icone, REGLES_ICONE_ETAPE) === null)
  .optional();
