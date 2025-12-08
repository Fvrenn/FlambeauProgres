import prisma from "@/lib/prisma";
import { type Commentaire } from "@prisma/client";

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
  /**
   * Adds a comment to a justification and handles side effects (notifications).
   */
  static async addComment(input: AddCommentInput): Promise<ServiceResult<Commentaire>> {
    const { authorId, justificationId, content, type } = input;

    if (!content.trim()) {
      return { success: false, error: "Le message ne peut pas être vide" };
    }

    try {
      // 1. Validate existence and fetch context
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

      // Domain Logic: Auth check should ideally be passed in or verified here if conditional
      // For now, we assume the caller checks general "can access" or we duplicate specific checks here if they are 'business rules'
      // The original code checked:
      // if (justification.chefId !== user.id) (for Chef Reply)

      if (type === "CHEF_REPONSE") {
        if (justification.chefId !== authorId) {
             return { success: false, error: "Vous n'êtes pas autorisé à commenter cette justification" };
        }
        if (justification.statut !== "DEMANDE_PRECISION") {
            return { success: false, error: "Cette justification n'est pas en demande de précisions" };
        }
      }

      // 2. Create Comment
      const newCommentaire = await prisma.commentaire.create({
        data: {
          justificationId,
          auteurId: authorId,
          contenu: content.trim(),
          type,
        },
        include: {
            auteur: true
        }
      });

      // 3. Handle Notifications (Side Effect)
      // This could be moved to an Event Bus later
      await this.handleNotifications(justification, authorId, type, content);

      return { success: true, data: newCommentaire };
    } catch (error) {
      console.error("Error in CommentService.addComment:", error);
      return { success: false, error: "Une erreur est survenue lors de l'ajout du commentaire" };
    }
  }

  private static async handleNotifications(justification: any, authorId: string, type: string, content: string) {
       // Logic moved from action
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
                    message: "Un chef a répondu à votre demande de précisions.", // Simplification, fetching name requires extra query or passing it
                    lue: false,
                }));
        
                await prisma.notification.createMany({
                    data: notifications,
                });
            }
       }
  }
}
