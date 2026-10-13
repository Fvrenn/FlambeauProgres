"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_REFERENT } from "@/lib/roles";
import { AccueilService } from "@/services/accueil.service";

const terminerAccueilSchema = z.object({
  etapeIds: z.array(z.string().min(1)).max(100).nullable(),
  groupe: z.string().regex(/^\d+$/).nullable(),
});

export async function terminerAccueil(reponses: {
  etapeIds: string[] | null;
  groupe: string | null;
}) {
  try {
    const user = await authorizeRole("CHEF", ...ROLES_REFERENT);

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    const parsed = terminerAccueilSchema.safeParse(reponses);

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await AccueilService.terminer(user.id, parsed.data);

    if (!result.success) {
      return result;
    }

    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la complétion du profil:", error);

    return { success: false, error: "Erreur serveur" };
  }
}

export async function passerAccueil() {
  try {
    const user = await authorizeRole("CHEF", ...ROLES_REFERENT);

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    await AccueilService.passer(user.id);

    return { success: true };
  } catch (error) {
    console.error("Erreur lors du report de la complétion du profil:", error);

    return { success: false, error: "Erreur serveur" };
  }
}
