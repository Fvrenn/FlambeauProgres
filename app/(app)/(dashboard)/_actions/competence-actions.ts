"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function submitCompetence(objectifId: string, contenu: string) {
  try {
    // Récupérer l'utilisateur connecté
    const user = await getUser();
    
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier que l'objectif existe et est bien de type COMPETENCE
    const objectif = await prisma.objectif.findUnique({
      where: { id: objectifId },
    });

    if (!objectif) {
      return { success: false, error: "Objectif non trouvé" };
    }

    if (objectif.type !== "COMPETENCE") {
      return { success: false, error: "Cet objectif n'est pas une compétence" };
    }

    // Vérifier s'il existe déjà une justification pour cet objectif et cet utilisateur
    const existingJustification = await prisma.justification.findFirst({
      where: {
        objectifId,
        chefId: user.id,
      },
    });

    if (existingJustification) {
      // Mettre à jour la justification existante
      await prisma.justification.update({
        where: { id: existingJustification.id },
        data: {
          contenu,
          statut: "AUTO_VALIDEE",
          valideeAt: new Date(),
        },
      });
    } else {
      // Créer une nouvelle justification avec statut AUTO_VALIDEE
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

    // Revalider la page dashboard pour rafraîchir les données
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
