"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function submitCompetence(objectifId: string, contenu: string) {
  try {
    const user = await getUser();
    
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const objectif = await prisma.objectif.findUnique({
      where: { id: objectifId },
    });

    if (!objectif) {
      return { success: false, error: "Objectif non trouvé" };
    }

    if (objectif.type !== "COMPETENCE") {
      return { success: false, error: "Cet objectif n'est pas une compétence" };
    }

    const existingJustification = await prisma.justification.findFirst({
      where: {
        objectifId,
        chefId: user.id,
      },
    });

    if (existingJustification) {
      await prisma.justification.update({
        where: { id: existingJustification.id },
        data: {
          contenu,
          statut: "AUTO_VALIDEE",
          valideeAt: new Date(),
        },
      });
    } else {
      await prisma.justification.create({
        data: {
          objectifId,
          chefId: user.id,
          etapeId: objectif.etapeId,
          contenu,
          statut: "AUTO_VALIDEE",
          valideeAt: new Date(),
        },
      });
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la soumission de la compétence:", error);
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la soumission" 
    };
  }
}
