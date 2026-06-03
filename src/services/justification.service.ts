import prisma from "@/lib/prisma";
import { NotificationService } from "@/services/notification.service";

export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

type FichierData = {
  nomOriginal: string;
  nomStockage: string;
  cheminFichier: string;
  type: "IMAGE" | "DOCUMENT";
  mimeType: string;
  taille: number;
};

export class JustificationService {
  static async approveJustification(
    justificationId: string,
    referentId: string,
  ): Promise<ServiceResult> {
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
      return {
        success: false,
        error: "Vous n'êtes pas référent de cette étape",
      };
    }

    await prisma.justification.update({
      where: { id: justificationId },
      data: {
        statut: "VALIDEE",
        valideeAt: new Date(),
      },
    });

    await NotificationService.createNotification({
      destinataireId: justification.chefId,
      justificationId: justificationId,
      type: "JUSTIFICATION_VALIDEE",
      titre: "Réalisation validée !",
      message: `Votre réalisation "${justification.objectif.code} - ${justification.objectif.description.substring(
        0,
        50,
      )}..." pour l'étape "${justification.objectif.etape.name}" a été validée par votre référent.`,
    });

    return { success: true };
  }

  static async rejectJustification(
    justificationId: string,
    referentId: string,
    motif: string,
  ): Promise<ServiceResult> {
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: { include: { etape: true } },
      },
    });

    if (!justification)
      return { success: false, error: "Justification introuvable" };

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

  static async requestChanges(
    justificationId: string,
    referentId: string,
    motif: string,
  ): Promise<ServiceResult> {
    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: { include: { etape: true } },
      },
    });

    if (!justification)
      return { success: false, error: "Justification introuvable" };

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

  static async submitCompetence(
    chefId: string,
    objectifId: string,
    contenu: string,
  ): Promise<ServiceResult> {
    const objectif = await prisma.objectif.findUnique({
      where: { id: objectifId },
    });

    if (!objectif) {
      return { success: false, error: "Objectif non trouvé" };
    }

    if (objectif.type !== "COMPETENCE") {
      return { success: false, error: "Cet objectif n'est pas une compétence" };
    }

    const existing = await prisma.justification.findFirst({
      where: { objectifId, chefId },
    });

    if (existing) {
      await prisma.justification.update({
        where: { id: existing.id },
        data: { contenu, statut: "AUTO_VALIDEE", valideeAt: new Date() },
      });
    } else {
      await prisma.justification.create({
        data: {
          objectifId,
          chefId,
          etapeId: objectif.etapeId,
          contenu,
          statut: "AUTO_VALIDEE",
          valideeAt: new Date(),
        },
      });
    }

    return { success: true };
  }

  static async submitRealisation(input: {
    chefId: string;
    chefName: string;
    objectifId: string;
    contenu: string;
    fichierData: FichierData | null;
  }): Promise<ServiceResult> {
    const { chefId, chefName, objectifId, contenu, fichierData } = input;

    const objectif = await prisma.objectif.findUnique({
      where: { id: objectifId },
      include: { etape: true },
    });

    if (!objectif) {
      return { success: false, error: "Objectif non trouvé" };
    }

    if (objectif.type !== "REALISATION") {
      return {
        success: false,
        error: "Cet objectif n'est pas une réalisation",
      };
    }

    const existing = await prisma.justification.findFirst({
      where: { objectifId, chefId },
    });

    let justificationId: string;

    if (existing) {
      const updated = await prisma.justification.update({
        where: { id: existing.id },
        data: { contenu, statut: "SOUMISE", soumiseAt: new Date() },
      });

      justificationId = updated.id;
    } else {
      const created = await prisma.justification.create({
        data: {
          objectifId,
          chefId,
          etapeId: objectif.etapeId,
          contenu,
          statut: "SOUMISE",
          soumiseAt: new Date(),
        },
      });

      justificationId = created.id;
    }

    if (fichierData) {
      await prisma.fichier.create({
        data: { justificationId, ...fichierData },
      });
    }

    await NotificationService.notifyReferentsOfNewJustification(
      objectif.etapeId,
      justificationId,
      chefName,
    );

    return { success: true };
  }
}
