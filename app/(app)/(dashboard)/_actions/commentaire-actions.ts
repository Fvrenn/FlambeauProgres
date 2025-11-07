"use server";

import prisma from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";

/**
 * Envoie une réponse (commentaire) du Chef sur une justification en DEMANDE_PRECISION.
 * 
 * Workflow :
 * 1. Récupère l'utilisateur (auteur du commentaire)
 * 2. Crée le Commentaire avec type: CHEF_REPONSE
 * 3. Le statut de la Justification RESTE DEMANDE_PRECISION
 * 4. Crée une Notification pour les Référents (type: NOUVEAU_COMMENTAIRE)
 * 5. Revalide les dashboards (Chef et Référent)
 */
export async function submitComment(
  justificationId: string,
  message: string
) {
  try {
    // 1. Récupérer l'utilisateur connecté
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    // Valider le message
    if (!message.trim()) {
      return { success: false, error: "Le message ne peut pas être vide" };
    }

    // 2. Récupérer la justification avec ses relations
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: {
          include: {
            etape: true,
          },
        },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification non trouvée" };
    }

    // Vérifier que c'est bien le Chef qui envoie le commentaire
    if (justification.chefId !== user.id) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à commenter cette justification",
      };
    }

    // Vérifier que le statut est bien DEMANDE_PRECISION
    if (justification.statut !== "DEMANDE_PRECISION") {
      return {
        success: false,
        error:
          "Cette justification n'est pas en demande de précisions",
      };
    }

    // 3. Créer le Commentaire de type CHEF_REPONSE
    const newCommentaire = await prisma.commentaire.create({
      data: {
        justificationId,
        auteurId: user.id,
        contenu: message.trim(),
        type: "CHEF_REPONSE",
      },
      include: {
        auteur: true,
      },
    });

    // 4. Récupérer les Référents assignés à cette étape pour les notifier
    const etapeReferents = await prisma.etapeReferent.findMany({
      where: { etapeId: justification.objectif.etape.id },
      include: { referent: true },
    });

    // Créer une notification pour chaque Référent
    if (etapeReferents.length > 0) {
      const notifications = etapeReferents.map((er) => ({
        destinataireId: er.referent.id,
        justificationId,
        type: "NOUVEAU_COMMENTAIRE" as const,
        titre: "Nouveau commentaire du Chef",
        message: `${user.name} a répondu à votre demande de précisions.`,
        lue: false,
      }));

      await prisma.notification.createMany({
        data: notifications,
      });
    }

    // 5. Revalider les chemins pour rafraîchir les dashboards
    revalidatePath("/dashboard"); // Dashboard du Chef
    revalidatePath("/referent/dashboard"); // Dashboard du Référent

    return {
      success: true,
      data: newCommentaire,
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du commentaire:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'envoi du commentaire",
    };
  }
}
