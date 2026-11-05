import type { Prisma, UserRole } from "@prisma/client";
import type { ChefAReviser } from "@/types";

import { prisma } from "@/lib/prisma";
import { NIVEAU_ETAPE_3, peutEvaluerEtape } from "@/lib/roles";
import {
  chefsAReviserPourEtape,
  JUSTIFICATION_SUIVIE_INCLUDE,
} from "@/services/referent.service";

export const FILTRE_ETAPES_NIVEAU_3 = {
  niveau: { gte: NIVEAU_ETAPE_3 },
  type: "BADGE",
  actif: true,
} satisfies Prisma.EtapeWhereInput;

export class SuiviEtape3Service {
  static async getEvaluations(role: UserRole) {
    const [justificationsAEvaluer, justificationsEnAttente] = await Promise.all(
      [
        prisma.justification.findMany({
          where: { etape: FILTRE_ETAPES_NIVEAU_3, statut: "SOUMISE" },
          include: JUSTIFICATION_SUIVIE_INCLUDE,
          orderBy: { soumiseAt: "asc" },
        }),
        prisma.justification.findMany({
          where: { etape: FILTRE_ETAPES_NIVEAU_3, statut: "DEMANDE_PRECISION" },
          include: JUSTIFICATION_SUIVIE_INCLUDE,
          orderBy: { updatedAt: "asc" },
        }),
      ],
    );

    return {
      justificationsAEvaluer,
      justificationsEnAttente,
      peutEvaluer: peutEvaluerEtape(role, NIVEAU_ETAPE_3, false),
    };
  }

  static compterEvaluations(): Promise<number> {
    return prisma.justification.count({
      where: { etape: FILTRE_ETAPES_NIVEAU_3, statut: "SOUMISE" },
    });
  }

  static getJustificationSuivie(justificationId: string) {
    return prisma.justification.findFirst({
      where: { id: justificationId, etape: FILTRE_ETAPES_NIVEAU_3 },
      include: JUSTIFICATION_SUIVIE_INCLUDE,
    });
  }

  static getDossiersAValider(): Promise<ChefAReviser[]> {
    return dossiersCompletsEtape3();
  }

  static async compterValidations(): Promise<number> {
    return (await dossiersCompletsEtape3()).length;
  }
}

async function dossiersCompletsEtape3(): Promise<ChefAReviser[]> {
  const etapes = await prisma.etape.findMany({
    where: FILTRE_ETAPES_NIVEAU_3,
    select: { id: true, name: true, niveau: true },
    orderBy: { ordre: "asc" },
  });

  return (await Promise.all(etapes.map(chefsAReviserPourEtape))).flat();
}
