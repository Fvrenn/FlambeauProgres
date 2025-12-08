"use server";

import { getUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { CommentService } from "@/services/comment.service";

/**
 * Envoie une réponse (commentaire) du Chef sur une justification en DEMANDE_PRECISION.
 */
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
      data: result.data,
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du commentaire:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'envoi du commentaire",
    };
  }
}
