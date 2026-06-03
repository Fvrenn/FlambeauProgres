"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";
import { CommentaireAvecAuteur } from "@/types";
import { CommentService } from "@/services/comment.service";
import { canAccessJustification } from "@/lib/auth-guards";

export async function getComments(justificationId: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const role = "role" in user ? user.role : undefined;
    const allowed = await canAccessJustification(
      user.id,
      role,
      justificationId,
    );

    if (!allowed) {
      return { success: false, error: "Accès refusé" };
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

export async function submitComment(justificationId: string, message: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const result = await CommentService.addComment({
      authorId: user.id,
      justificationId,
      content: message,
      type: "CHEF_REPONSE",
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
