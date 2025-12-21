"use server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { CommentaireAvecAuteur } from "@/types";
import { CommentService } from "@/services/comment.service";

/**
 * Récupère les commentaires d'une justification.
 * Utilisé pour le Lazy Loading du ChatPanel.
 */
export async function getComments(justificationId: string) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const commentaires = await prisma.commentaire.findMany({
      where: { justificationId },
      include: {
        auteur: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, data: commentaires as CommentaireAvecAuteur[] };
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

export async function submitComment(
  justificationId: string,
  message: string
) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const result = await CommentService.addComment({
      authorId: user.id,
      justificationId,
      content: message,
      type: "CHEF_REPONSE"
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard");
    revalidatePath("/referent/dashboard");

    return {
      success: true,
      data: result.data as CommentaireAvecAuteur,
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du commentaire:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'envoi du commentaire",
    };
  }
}
