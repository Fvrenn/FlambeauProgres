import prisma from "@/lib/prisma";
import { NotificationService } from "@/services/notification.service";

export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class EtapeService {
  /**
   * Valide l'étape (badge) complète pour un chef.
   */
  static async validateBadge(
    chefId: string,
    referentId: string,
    etapeId: string
  ): Promise<ServiceResult> {
    // 1. Vérification des existences et droits
    const [etape, assignation] = await Promise.all([
      prisma.etape.findUnique({ where: { id: etapeId } }),
      prisma.etapeReferent.findFirst({
        where: { referentId: referentId, etapeId: etapeId },
      }),
    ]);

    if (!etape) return { success: false, error: "Étape introuvable" };
    if (!assignation) return { success: false, error: "Vous n'êtes pas référent de cette étape" };

    // 2. Upsert du statut
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

    // 3. Notification
    await NotificationService.createNotification({
      destinataireId: chefId,
      type: "ETAPE_COMPLETE",
      titre: "Badge validé !",
      message: `Félicitations ! Votre badge "${etape.name}" a été officiellement validé par votre référent.`,
    });

    return { success: true };
  }
}
