"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_REFERENT } from "@/lib/roles";
import { WpProgressionService } from "@/services/wp-progression.service";

const declarerProgressionSchema = z.object({
  etapeIds: z.array(z.string().min(1)).max(100),
});

export async function declarerProgressionPlateforme(etapeIds: string[]) {
  try {
    const user = await authorizeRole("CHEF", ...ROLES_REFERENT);

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    const parsed = declarerProgressionSchema.safeParse({ etapeIds });

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await WpProgressionService.declarerSurPlateforme(
      user.id,
      parsed.data.etapeIds,
    );

    if (!result.success) {
      return result;
    }

    revalidatePath("/profil");
    revalidatePath("/progression");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la déclaration de progression:", error);

    return { success: false, error: "Erreur serveur" };
  }
}
