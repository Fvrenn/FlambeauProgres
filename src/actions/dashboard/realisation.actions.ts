"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { StorageService } from "@/services/storage.service";

async function notifyReferents(
  etapeId: string,
  justificationId: string,
  chefName: string
) {
  try {
    const etapeReferents = await prisma.etapeReferent.findMany({
      where: { etapeId },
      include: { referent: true, etape: true },
    });

    if (etapeReferents.length === 0) {
      console.warn(`Aucun référent trouvé pour l'étape ${etapeId}`);
      return;
    }

    const notifications = etapeReferents.map((er) => ({
      destinataireId: er.referent.id,
      justificationId,
      type: "NOUVELLE_JUSTIFICATION" as const,
      titre: "Nouvelle réalisation à valider",
      message: `${chefName} a soumis une nouvelle réalisation pour l'étape "${er.etape.name}".`,
      lue: false,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

  } catch (error) {
    console.error("Erreur lors de la création des notifications:", error);
  }
}

export async function submitRealisation(
  objectifId: string,
  contenu: string,
  file?: File
) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const objectif = await prisma.objectif.findUnique({
      where: { id: objectifId },
      include: { etape: true },
    });

    if (!objectif) {
      return { success: false, error: "Objectif non trouvé" };
    }

    if (objectif.type !== "REALISATION") {
      return {
        success: false,
        error: "Cet objectif n'est pas une réalisation",
      };
    }

    let fichierData: any = null;

    if (file) {
      try {
        const result = await StorageService.uploadFile(file, "justifications");
        
        fichierData = {
          nomOriginal: file.name,
          nomStockage: result.pathname,
          cheminFichier: result.url,
          type: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT",
          mimeType: file.type || "application/octet-stream",
          taille: file.size,
        };
      } catch (uploadError) {
        console.error("Erreur d'upload:", uploadError);
        return { success: false, error: "Erreur lors du téléchargement du fichier" };
      }
    }

    const existingJustification = await prisma.justification.findFirst({
      where: {
        objectifId,
        chefId: user.id,
      },
    });

    let justificationId: string;

    if (existingJustification) {
      const updated = await prisma.justification.update({
        where: { id: existingJustification.id },
        data: {
          contenu,
          statut: "SOUMISE",
          soumiseAt: new Date(),
        },
      });
      justificationId = updated.id;

      if (fichierData) {
        await prisma.fichier.create({
          data: {
            justificationId: updated.id,
            ...fichierData,
          },
        });
      }
    } else {
      const created = await prisma.justification.create({
        data: {
          objectifId,
          chefId: user.id,
          etapeId: objectif.etapeId,
          contenu,
          statut: "SOUMISE",
          soumiseAt: new Date(),
        },
      });
      justificationId = created.id;

      if (fichierData) {
        await prisma.fichier.create({
          data: {
            justificationId: created.id,
            ...fichierData,
          },
        });
      }
    }

    await notifyReferents(objectif.etapeId, justificationId, user.name);

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

