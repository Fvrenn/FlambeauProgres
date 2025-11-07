"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "@/src/lib/auth-server";

/**
 * Valide une justification soumise par un Chef
 */
export async function approveJustification(justificationId: string) {
  try {
    // Vérifier que l'utilisateur est bien un Référent
    const user = await getUser();
    // --- CORRECTION : Ajout de la garde de type "role" in user ---
    if (!user || !("role" in user) || user.role !== "REFERENT") {
      return { success: false, error: "Non autorisé" };
    }

    // Récupérer la justification avec ses relations
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        chef: true,
        objectif: {
          include: {
            etape: true,
          },
        },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification introuvable" };
    }

    // Vérifier que le Référent est bien assigné à cette étape
    const assignation = await prisma.etapeReferent.findFirst({
      where: {
        referentId: user.id,
        etapeId: justification.etapeId,
      },
    });

    if (!assignation) {
      return { success: false, error: "Vous n'êtes pas référent de cette étape" };
    }

    // Mettre à jour la justification
    await prisma.justification.update({
      where: { id: justificationId },
      data: {
        statut: "VALIDEE",
        valideeAt: new Date(),
      },
    });

    // Créer une notification pour le Chef
    await prisma.notification.create({
      data: {
        destinataireId: justification.chefId,
        justificationId: justificationId,
        type: "JUSTIFICATION_VALIDEE",
        titre: "Réalisation validée !",
        message: `Votre réalisation "${justification.objectif.code} - ${justification.objectif.description.substring(0, 50)}..." pour l'étape "${justification.objectif.etape.name}" a été validée par votre référent.`,
      },
    });

    // Revalider la page pour mettre à jour l'affichage
    revalidatePath("/referent/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/**
 * Refuse une justification avec un motif
 */
export async function rejectJustification(
  justificationId: string,
  motif: string
) {
  try {
    // Vérifier que l'utilisateur est bien un Référent
    const user = await getUser();
    // --- CORRECTION : Ajout de la garde de type "role" in user ---
    if (!user || !("role" in user) || user.role !== "REFERENT") {
      return { success: false, error: "Non autorisé" };
    }

    // Récupérer la justification avec ses relations
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        chef: true,
        objectif: {
          include: {
            etape: true,
          },
        },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification introuvable" };
    }

    // Vérifier que le Référent est bien assigné à cette étape
    const assignation = await prisma.etapeReferent.findFirst({
      where: {
        referentId: user.id,
        etapeId: justification.etapeId,
      },
    });

    if (!assignation) {
      return { success: false, error: "Vous n'êtes pas référent de cette étape" };
    }

    // Mettre à jour la justification
    await prisma.justification.update({
      where: { id: justificationId },
      data: {
        statut: "REFUSEE",
      },
    });

    // Créer un commentaire avec le motif du refus
    await prisma.commentaire.create({
      data: {
        justificationId: justificationId,
        auteurId: user.id,
        contenu: motif,
        type: "REFERENT_FEEDBACK",
      },
    });

    // Créer une notification pour le Chef
    await prisma.notification.create({
      data: {
        destinataireId: justification.chefId,
        justificationId: justificationId,
        type: "JUSTIFICATION_REFUSEE",
        titre: "Réalisation refusée",
        message: `Votre réalisation "${justification.objectif.code} - ${justification.objectif.description.substring(0, 50)}..." pour l'étape "${justification.objectif.etape.name}" a été refusée. Consultez les commentaires pour plus de détails.`,
      },
    });

    // Revalider la page pour mettre à jour l'affichage
    revalidatePath("/referent/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors du refus:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/**
 * Demande des précisions sur une justification (envoie un commentaire et change le statut)
 */
export async function requestChanges(
  justificationId: string,
  motif: string
) {
  console.log("🔵 [requestChanges SERVER] DÉBUT - justificationId:", justificationId);
  console.log("🔵 [requestChanges SERVER] motif reçu:", motif.substring(0, 50) + "...");

  try {
    // Vérifier que l'utilisateur est bien un Référent
    console.log("🔵 [requestChanges SERVER] Récupération de l'utilisateur");
    const user = await getUser();
    console.log("🔵 [requestChanges SERVER] Utilisateur récupéré:", user?.id, ("role" in user!) ? user.role : "no role");

    if (!user || !("role" in user) || user.role !== "REFERENT") {
      console.log("❌ [requestChanges SERVER] Utilisateur non autorisé");
      return { success: false, error: "Non autorisé" };
    }

    // Récupérer la justification avec ses relations
    console.log("🔵 [requestChanges SERVER] Récupération de la justification");
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        chef: true,
        objectif: {
          include: {
            etape: true,
          },
        },
      },
    });

    if (!justification) {
      console.log("❌ [requestChanges SERVER] Justification non trouvée");
      return { success: false, error: "Justification introuvable" };
    }

    console.log("🔵 [requestChanges SERVER] Justification trouvée, etapeId:", justification.etapeId);

    // Vérifier que le Référent est bien assigné à cette étape
    console.log("🔵 [requestChanges SERVER] Vérification assignation étape");
    const assignation = await prisma.etapeReferent.findFirst({
      where: {
        referentId: user.id,
        etapeId: justification.etapeId,
      },
    });

    if (!assignation) {
      console.log("❌ [requestChanges SERVER] Référent non assigné à cette étape");
      return { success: false, error: "Vous n'êtes pas référent de cette étape" };
    }

    console.log("✅ [requestChanges SERVER] Référent autorisé, etapeId:", assignation.etapeId);

    // Mettre à jour la justification au statut DEMANDE_PRECISION
    console.log("🔵 [requestChanges SERVER] Mise à jour statut DEMANDE_PRECISION");
    const updatedJustif = await prisma.justification.update({
      where: { id: justificationId },
      data: {
        statut: "DEMANDE_PRECISION",
      },
    });
    console.log("✅ [requestChanges SERVER] Justification mise à jour, nouveau statut:", updatedJustif.statut);

    // Créer un commentaire avec la demande de précisions
    console.log("🔵 [requestChanges SERVER] Création du commentaire");
    const newCommentaire = await prisma.commentaire.create({
      data: {
        justificationId: justificationId,
        auteurId: user.id,
        contenu: motif,
        type: "REFERENT_QUESTION",
      },
    });
    console.log("✅ [requestChanges SERVER] Commentaire créé, id:", newCommentaire.id);

    // Créer une notification pour le Chef
    console.log("🔵 [requestChanges SERVER] Création notification pour le Chef");
    const notification = await prisma.notification.create({
      data: {
        destinataireId: justification.chefId,
        justificationId: justificationId,
        type: "DEMANDE_PRECISION",
        titre: "Demande de précisions",
        message: `Votre référent a besoin de précisions sur votre réalisation "${justification.objectif.code}" pour l'étape "${justification.objectif.etape.name}". Consultez la discussion pour voir la demande.`,
      },
    });
    console.log("✅ [requestChanges SERVER] Notification créée, id:", notification.id);

    // Revalider la page pour mettre à jour l'affichage
    console.log("🔵 [requestChanges SERVER] Appel revalidatePath");
    revalidatePath("/referent/dashboard");
    console.log("✅ [requestChanges SERVER] revalidatePath exécuté");

    console.log("🟢 [requestChanges SERVER] SUCCESS - Demande de précisions envoyée");
    return { success: true };
  } catch (error) {
    console.error("❌ [requestChanges SERVER] ERREUR:", error);
    console.error("❌ [requestChanges SERVER] Détails:", {
      justificationId,
      motifLength: motif.length,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : "No stack",
    });
    return { success: false, error: "Erreur serveur" };
  }
}