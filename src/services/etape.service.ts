import { STATUTS_VALIDES } from "@/lib/justification";
import prisma from "@/lib/prisma";
import { NotificationService } from "@/services/notification.service";

export type ServiceResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type EtapeProgressForChef = {
  id: string;
  number: string;
  name: string;
  imageSrc: string | null;
  couleur: string | null;
  done: number;
  total: number;
};

export class EtapeService {
  static async getProgressForChef(
    chefId: string,
  ): Promise<EtapeProgressForChef[]> {
    const [etapes, validees] = await Promise.all([
      prisma.etape.findMany({
        orderBy: { ordre: "asc" },
        select: {
          id: true,
          number: true,
          name: true,
          image_src: true,
          couleur: true,
          _count: { select: { objectifs: true } },
        },
      }),
      prisma.justification.groupBy({
        by: ["etapeId"],
        where: { chefId, statut: { in: STATUTS_VALIDES } },
        _count: { id: true },
      }),
    ]);

    const doneByEtape = new Map(validees.map((v) => [v.etapeId, v._count.id]));

    return etapes.map((etape) => ({
      id: etape.id,
      number: etape.number,
      name: etape.name,
      imageSrc: etape.image_src,
      couleur: etape.couleur,
      done: doneByEtape.get(etape.id) ?? 0,
      total: etape._count.objectifs,
    }));
  }

  static async getDashboardEtapesForChef(chefId: string) {
    const [etapes, statutsValides] = await Promise.all([
      prisma.etape.findMany({
        orderBy: { ordre: "asc" },
        include: {
          objectifs: {
            include: { justifications: { where: { chefId } } },
          },
        },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { chefId, statut: "VALIDE" },
        select: { etapeId: true },
      }),
    ]);

    const etapesIdsValidees = new Set(statutsValides.map((s) => s.etapeId));

    return etapes.map((etape) => ({
      ...etape,
      isValidated: etapesIdsValidees.has(etape.id),
    }));
  }

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
