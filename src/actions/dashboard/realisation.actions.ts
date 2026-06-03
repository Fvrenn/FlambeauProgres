"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth-server";
import { StorageService } from "@/services/storage.service";
import { JustificationService } from "@/services/justification.service";

const submitRealisationSchema = z.object({
  objectifId: z.string().min(1),
  contenu: z.string(),
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

    let fichierData: {
      nomOriginal: string;
      nomStockage: string;
      cheminFichier: string;
      type: "IMAGE" | "DOCUMENT";
      mimeType: string;
      taille: number;
    } | null = null;

    if (file) {
      try {
        const result = await StorageService.uploadFile(file, "justifications");

        fichierData = {
          nomOriginal: file.name,
          nomStockage: result.fileName,
          cheminFichier: result.storedPath,
          type: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT",
          mimeType: file.type || "application/octet-stream",
          taille: file.size,
        };
      } catch (uploadError) {
        console.error("Erreur d'upload:", uploadError);

        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Erreur lors du téléchargement du fichier";

        return { success: false, error: message };
      }
    }

    const result = await JustificationService.submitRealisation({
      chefId: user.id,
      chefName: user.name,
      objectifId: parsed.data.objectifId,
      contenu: parsed.data.contenu,
      fichierData,
    });

    if (!result.success) {
      return result;
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la soumission de la réalisation:", error);

    return {
      success: false,
      error: "Une erreur est survenue lors de la soumission",
    };
  }
}
