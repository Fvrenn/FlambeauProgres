"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth-server";
import { EtapeService } from "@/services/etape.service";

const validateEtapeSchema = z.object({
  chefId: z.string().min(1),
  etapeId: z.string().min(1),
});

export async function validateEtape(chefId: string, etapeId: string) {
  try {
    const user = await getUser();

    if (!user || !("role" in user) || user.role !== "REFERENT") {
      return { success: false, error: "Non autorisé" };
    }

    const parsed = validateEtapeSchema.safeParse({ chefId, etapeId });

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const result = await EtapeService.validateBadge(
      parsed.data.chefId,
      user.id,
      parsed.data.etapeId,
    );

    if (!result.success) {
      return result;
    }

    revalidatePath(`/referent/dashboard?etapeId=${parsed.data.etapeId}`);
  } catch (error) {
    console.error("Erreur lors de la validation finale de l'étape:", error);

    return { success: false, error: "Erreur serveur" };
  }

  redirect(`/referent/dashboard?etapeId=${etapeId}`);
}
