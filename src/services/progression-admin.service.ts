import type { Prisma } from "@prisma/client";
import type { ServiceResult } from "@/types";

import { prisma } from "@/lib/prisma";
import { StorageService } from "@/services/storage.service";
import { USER_RESUME_SELECT } from "@/services/user.service";

const JUSTIFICATION_ADMIN_SELECT = {
  id: true,
  statut: true,
  contenu: true,
  soumiseAt: true,
  valideeAt: true,
  updatedAt: true,
  objectif: { select: { code: true, description: true, type: true } },
  _count: { select: { messages: true, fichiers: true } },
} as const satisfies Prisma.JustificationSelect;

export type JustificationAdmin = Prisma.JustificationGetPayload<{
  select: typeof JUSTIFICATION_ADMIN_SELECT;
}>;

export class ProgressionAdminService {
  static async getPourUtilisateur(userId: string) {
    const utilisateur = await prisma.user.findUnique({
      where: { id: userId },
      select: USER_RESUME_SELECT,
    });

    if (!utilisateur) {
      return null;
    }

    const etapes = await prisma.etape.findMany({
      where: {
        OR: [
          { justifications: { some: { chefId: userId } } },
          { statutsChefs: { some: { chefId: userId } } },
        ],
      },
      orderBy: [{ niveau: "asc" }, { ordre: "asc" }],
      select: {
        id: true,
        number: true,
        name: true,
        statutsChefs: {
          where: { chefId: userId },
          select: { statut: true, origine: true, valideeAt: true },
        },
        justifications: {
          where: { chefId: userId },
          orderBy: { objectif: { code: "asc" } },
          select: JUSTIFICATION_ADMIN_SELECT,
        },
      },
    });

    return {
      utilisateur,
      etapes: etapes.map(({ statutsChefs, ...etape }) => ({
        ...etape,
        statut: statutsChefs[0] ?? null,
      })),
    };
  }

  static async supprimerJustification(
    chefId: string,
    justificationId: string,
  ): Promise<ServiceResult> {
    const fichiers = await prisma.fichier.findMany({
      where: { justificationId, justification: { chefId } },
      select: { cheminFichier: true },
    });

    const { count } = await prisma.justification.deleteMany({
      where: { id: justificationId, chefId },
    });

    if (count === 0) {
      return { success: false, error: "Justification introuvable" };
    }

    await supprimerFichiersStockes(fichiers);

    return { success: true };
  }

  static async reinitialiserEtape(
    chefId: string,
    etapeId: string,
  ): Promise<ServiceResult> {
    const fichiers = await prisma.fichier.findMany({
      where: { justification: { chefId, etapeId } },
      select: { cheminFichier: true },
    });

    await prisma.$transaction([
      prisma.justification.deleteMany({ where: { chefId, etapeId } }),
      prisma.chefEtapeStatut.deleteMany({ where: { chefId, etapeId } }),
    ]);

    await supprimerFichiersStockes(fichiers);

    return { success: true };
  }
}

async function supprimerFichiersStockes(
  fichiers: { cheminFichier: string }[],
): Promise<void> {
  await Promise.all(
    fichiers.map((fichier) => StorageService.deleteFile(fichier.cheminFichier)),
  );
}
