import prisma from "@/lib/prisma";
import { NotificationService } from "@/services/notification.service";

export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class EtapeService {
  static async validateBadge(
    chefId: string,
    referentId: string,
    etapeId: string,
  ): Promise<ServiceResult> {
    const [etape, chef, assignation] = await Promise.all([
      prisma.etape.findUnique({ where: { id: etapeId } }),
      prisma.user.findUnique({ where: { id: chefId } }),
      prisma.etapeReferent.findFirst({
        where: { referentId: referentId, etapeId: etapeId },
      }),
    ]);

    if (!etape || !chef) {
      return { success: false, error: "Étape ou Chef introuvable" };
    }

    if (!assignation) {
      return {
        success: false,
        error: "Vous n'êtes pas référent de cette étape",
      };
    }

    await prisma.chefEtapeStatut.upsert({
      where: {
        chefId_etapeId: {
          chefId: chefId,
          etapeId: etapeId,
        },
      },
      update: {
        statut: "VALIDE",
        valideeAt: new Date(),
        valideeParId: referentId,
      },
      create: {
        chefId: chefId,
        etapeId: etapeId,
        statut: "VALIDE",
        valideeAt: new Date(),
        valideeParId: referentId,
      },
    });

    await NotificationService.createNotification({
      destinataireId: chefId,
      type: "ETAPE_COMPLETE",
      titre: "Badge validé !",
      message: `Félicitations ! Votre badge "${etape.name}" a été officiellement validé par votre référent. Vous pouvez le coudre sur votre chemise !`,
    });

    return { success: true };
  }
}
