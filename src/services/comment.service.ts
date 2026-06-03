import { Prisma, type Commentaire } from "@prisma/client";

import prisma from "@/lib/prisma";

export type AddCommentInput = {
  authorId: string;
  justificationId: string;
  content: string;
  type: "CHEF_REPONSE" | "REFERENT_QUESTION" | "REFERENT_FEEDBACK" | "SYSTEM";
};

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export class CommentService {
  static async addComment(
    input: AddCommentInput,
  ): Promise<ServiceResult<Commentaire>> {
    const { authorId, justificationId, content, type } = input;

    if (!content.trim()) {
      return { success: false, error: "Le message ne peut pas être vide" };
    }

    try {
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

      if (type === "CHEF_REPONSE") {
        if (justification.chefId !== authorId) {
          return {
            success: false,
            error: "Vous n'êtes pas autorisé à commenter cette justification",
          };
        }
        if (justification.statut !== "DEMANDE_PRECISION") {
          return {
            success: false,
            error: "Cette justification n'est pas en demande de précisions",
          };
        }
      }

      const newCommentaire = await prisma.commentaire.create({
        data: {
          justificationId,
          auteurId: authorId,
          contenu: content.trim(),
          type,
        },
        include: {
          auteur: true,
        },
      });

      await this.handleNotifications(justification, authorId, type, content);

      return { success: true, data: newCommentaire };
    } catch (error) {
      console.error("Error in CommentService.addComment:", error);

      return {
        success: false,
        error: "Une erreur est survenue lors de l'ajout du commentaire",
      };
    }
  }

  private static async handleNotifications(
    justification: Prisma.JustificationGetPayload<{
      include: { objectif: { include: { etape: true } } };
    }>,
    authorId: string,
    type: string,
    content: string,
  ) {
    if (type === "CHEF_REPONSE") {
      const etapeReferents = await prisma.etapeReferent.findMany({
        where: { etapeId: justification.objectif.etape.id },
        include: { referent: true },
      });

      if (etapeReferents.length > 0) {
        const notifications = etapeReferents.map((er) => ({
          destinataireId: er.referent.id,
          justificationId: justification.id,
          type: "NOUVEAU_COMMENTAIRE" as const,
          titre: "Nouveau commentaire du Chef",
          message: "Un chef a répondu à votre demande de précisions.",
          lue: false,
        }));

        await prisma.notification.createMany({
          data: notifications,
        });
      }
    }
  }
}
