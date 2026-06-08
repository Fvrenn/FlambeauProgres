import prisma from "@/lib/prisma";
import { NotificationService } from "@/services/notification.service";
import {
  DiscussionService,
  type FichierData,
} from "@/services/discussion.service";

export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class JustificationService {
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

    const trimmed = contenu.trim();

    if (objectif.texteRequis && !trimmed) {
      return {
        success: false,
        error: "La description est obligatoire pour cet objectif",
      };
    }

    const existing = await prisma.justification.findFirst({
      where: { objectifId, chefId },
    });

    if (existing) {
      await prisma.justification.update({
        where: { id: existing.id },
        data: {
          contenu: trimmed || null,
          statut: "AUTO_VALIDEE",
          valideeAt: new Date(),
        },
      });
    } else {
      await prisma.justification.create({
        data: {
          objectifId,
          chefId,
          etapeId: objectif.etapeId,
          contenu: trimmed || null,
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

    const trimmed = contenu.trim();

    if (objectif.texteRequis && !trimmed) {
      return {
        success: false,
        error: "La description est obligatoire pour cet objectif",
      };
    }

    if (!trimmed && !fichierData) {
      return { success: false, error: "Ajoute une description ou un fichier" };
    }

    const existing = await prisma.justification.findFirst({
      where: { objectifId, chefId },
    });

    const justificationId = await prisma.$transaction(async (tx) => {
      const justification = existing
        ? await tx.justification.update({
            where: { id: existing.id },
            data: {
              contenu: trimmed || null,
              statut: "SOUMISE",
              soumiseAt: new Date(),
            },
          })
        : await tx.justification.create({
            data: {
              objectifId,
              chefId,
              etapeId: objectif.etapeId,
              contenu: trimmed || null,
              statut: "SOUMISE",
              soumiseAt: new Date(),
            },
          });

      await DiscussionService.addMessage(tx, {
        justificationId: justification.id,
        auteurId: chefId,
        contenu: trimmed || null,
        type: "USER",
        fichierData,
      });

      return justification.id;
    });

    await NotificationService.notifyReferentsOfNewJustification(
      objectif.etapeId,
      justificationId,
      chefName,
    );

    return { success: true };
  }
}
