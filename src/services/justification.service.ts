import prisma from "@/lib/prisma";
import { NotificationService } from "@/services/notification.service";


export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class JustificationService {
  /**
   * Valide une justification et notifie le chef.
   */
  static async approveJustification(
    justificationId: string,
    referentId: string
  ): Promise<ServiceResult> {
    // 1. Validation des droits et existence
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: { include: { etape: true } },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification introuvable" };
    }

    const assignation = await prisma.etapeReferent.findFirst({
      where: {
        referentId: referentId,
        etapeId: justification.etapeId,
      },
    });

    if (!assignation) {
      return { success: false, error: "Vous n'êtes pas référent de cette étape" };
    }

    // 2. Mise à jour DB
    await prisma.justification.update({
      where: { id: justificationId },
      data: {
        statut: "VALIDEE",
        valideeAt: new Date(),
      },
    });

    // 3. Notification (Side Effect)
    await NotificationService.createNotification({
      destinataireId: justification.chefId,
      justificationId: justificationId,
      type: "JUSTIFICATION_VALIDEE",
      titre: "Réalisation validée !",
      message: `Votre réalisation "${justification.objectif.code} - ${justification.objectif.description.substring(
        0,
        50
      )}..." pour l'étape "${justification.objectif.etape.name}" a été validée par votre référent.`,
    });

    return { success: true };
  }

  /**
   * Refuse une justification, ajoute un commentaire et notifie le chef.
   */
  static async rejectJustification(
    justificationId: string,
    referentId: string,
    motif: string
  ): Promise<ServiceResult> {
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: { include: { etape: true } },
      },
    });

    if (!justification) return { success: false, error: "Justification introuvable" };

    const assignation = await prisma.etapeReferent.findFirst({
      where: {
        referentId: referentId,
        etapeId: justification.etapeId,
      },
    });

    if (!assignation) return { success: false, error: "Non autorisé" };

    await prisma.justification.update({
      where: { id: justificationId },
      data: { statut: "REFUSEE" },
    });

    await prisma.commentaire.create({
      data: {
        justificationId,
        auteurId: referentId,
        contenu: motif,
        type: "REFERENT_FEEDBACK",
      },
    });

    await NotificationService.createNotification({
      destinataireId: justification.chefId,
      justificationId: justificationId,
      type: "JUSTIFICATION_REFUSEE",
      titre: "Réalisation refusée",
      message: `Votre réalisation "${justification.objectif.code}" a été refusée. Voir la raison dans les commentaires.`,
    });

    return { success: true };
  }

  /**
   * Demande des précisions (statut DEMANDE_PRECISION + Commentaire Question).
   */
  static async requestChanges(
    justificationId: string,
    referentId: string,
    motif: string
  ): Promise<ServiceResult> {
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: { include: { etape: true } },
      },
    });

    if (!justification) return { success: false, error: "Justification introuvable" };

    const assignation = await prisma.etapeReferent.findFirst({
      where: {
        referentId: referentId,
        etapeId: justification.etapeId,
      },
    });

    if (!assignation) return { success: false, error: "Non autorisé" };

    await prisma.justification.update({
      where: { id: justificationId },
      data: { statut: "DEMANDE_PRECISION" },
    });

    await prisma.commentaire.create({
      data: {
        justificationId,
        auteurId: referentId,
        contenu: motif,
        type: "REFERENT_QUESTION",
      },
    });

    await NotificationService.createNotification({
      destinataireId: justification.chefId,
      justificationId: justificationId,
      type: "DEMANDE_PRECISION",
      titre: "Demande de précisions",
      message: `Votre référent demande des précisions sur "${justification.objectif.code}".`,
    });

    return { success: true };
  }
}
