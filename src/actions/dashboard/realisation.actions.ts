"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth-server";
import { LONGUEUR_MAX_CONTENU } from "@/lib/justification";
import { StorageService } from "@/services/storage.service";
import { JustificationService } from "@/services/justification.service";
import { DiscussionService } from "@/services/discussion.service";

const submitRealisationSchema = z.object({
  objectifId: z.string().min(1),
  contenu: z.string().max(LONGUEUR_MAX_CONTENU),
});

export async function submitRealisation(
  objectifId: string,
  contenu: string,
  file?: File,
) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const parsed = submitRealisationSchema.safeParse({ objectifId, contenu });

    if (!parsed.success) {
      return { success: false, error: "Données invalides" };
    }

    const pieceJointe = await DiscussionService.stockerPieceJointe(file);

    if (!pieceJointe.success) {
      return pieceJointe;
    }

    const fichierData = pieceJointe.data;

    const result = await JustificationService.submitRealisation({
      chefId: user.id,
      chefName: user.name,
      objectifId: parsed.data.objectifId,
      contenu: parsed.data.contenu,
      fichierData,
    });

    if (!result.success) {
      if (fichierData) {
        await StorageService.deleteFile(fichierData.cheminFichier);
      }

      return result;
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la soumission de la réalisation:", error);

    return {
      success: false,
      error: "Une erreur est survenue lors de la soumission",
    };
  }
}
