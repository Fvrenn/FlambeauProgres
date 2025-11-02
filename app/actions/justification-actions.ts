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