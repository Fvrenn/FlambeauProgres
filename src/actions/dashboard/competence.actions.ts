"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth-server";
import { JustificationService } from "@/services/justification.service";

const submitCompetenceSchema = z.object({
  objectifId: z.string().min(1),
  contenu: z.string(),
});

export async function submitCompetence(objectifId: string, contenu: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const parsed = submitCompetenceSchema.safeParse({ objectifId, contenu });

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await JustificationService.submitCompetence(
      user.id,
      parsed.data.objectifId,
      parsed.data.contenu,
    );

    if (!result.success) {
      return result;
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la soumission de la compétence:", error);

    return {
      success: false,
      error: "Une erreur est survenue lors de la soumission",
    };
  }
}
