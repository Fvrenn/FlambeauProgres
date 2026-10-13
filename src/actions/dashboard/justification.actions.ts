"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth-server";
import { JustificationService } from "@/services/justification.service";

const justificationIdSchema = z.string().min(1);

export async function annulerJustification(justificationId: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const parsed = justificationIdSchema.safeParse(justificationId);

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await JustificationService.annuler({
      chefId: user.id,
      justificationId: parsed.data,
    });

    if (!result.success) {
      return result;
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'annulation:", error);

    return { success: false, error: "Une erreur est survenue" };
  }
}
