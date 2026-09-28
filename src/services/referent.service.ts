import type { UserRole } from "@prisma/client";

import { chefsAyantToutValide } from "@/lib/justification";
import { prisma } from "@/lib/prisma";
import { peutEvaluerEtape, peutValiderEtape } from "@/lib/roles";
import { USER_RESUME_SELECT } from "@/services/user.service";

export type ReferentConnecte = { id: string; role: UserRole };

export class ReferentService {
  static async getDashboard(etapeId: string, referent: ReferentConnecte) {
    const [
      totaux,
      validations,
      badgesValides,
      justificationsAValider,
      justificationsEnDiscussion,
      etape,
      assignation,
    ] = await Promise.all([
      prisma.objectif.groupBy({
        by: ["type"],
        where: { etapeId },
        _count: { id: true },
      }),
      prisma.justification.findMany({
        where: {
          etapeId,
          OR: [
            { statut: "AUTO_VALIDEE", objectif: { type: "COMPETENCE" } },
            { statut: "VALIDEE", objectif: { type: "REALISATION" } },
          ],
        },
        select: { chefId: true, objectif: { select: { type: true } } },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { etapeId, statut: "VALIDE" },
        select: { chefId: true },
      }),
      prisma.justification.findMany({
        where: { etapeId, statut: "SOUMISE" },
        include: {
          chef: { select: USER_RESUME_SELECT },
          objectif: true,
          messages: { select: { auteurId: true } },
        },
        orderBy: { soumiseAt: "asc" },
      }),
      prisma.justification.findMany({
        where: { etapeId, statut: "DEMANDE_PRECISION" },
        include: { chef: { select: USER_RESUME_SELECT }, objectif: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.etape.findUnique({
        where: { id: etapeId },
        select: { niveau: true },
      }),
      prisma.etapeReferent.findFirst({
        where: { referentId: referent.id, etapeId },
      }),
    ]);

    const dejaValides = new Set(badgesValides.map(({ chefId }) => chefId));
    const chefsAReviserIds = chefsAyantToutValide(
      validations.map(({ chefId, objectif }) => ({
        chefId,
        type: objectif.type,
      })),
      {
        competences: compterType(totaux, "COMPETENCE"),
        realisations: compterType(totaux, "REALISATION"),
      },
    ).filter((chefId) => !dejaValides.has(chefId));

    const chefsAReviser =
      chefsAReviserIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: chefsAReviserIds } },
            select: USER_RESUME_SELECT,
          })
        : [];

    return {
      chefsAReviser,
      justificationsAValider,
      justificationsEnDiscussion,
      peutEvaluer: peutEvaluerEtape(
        referent.role,
        etape?.niveau ?? 0,
        Boolean(assignation),
      ),
    };
  }

  static async getRevision(
    chefId: string,
    etapeId: string,
    referent: ReferentConnecte,
  ) {
    const [chef, etape, justifications, assignation] = await Promise.all([
      prisma.user.findUnique({
        where: { id: chefId },
        select: USER_RESUME_SELECT,
      }),
      prisma.etape.findUnique({ where: { id: etapeId } }),
      prisma.justification.findMany({
        where: {
          chefId,
          etapeId,
          statut: "AUTO_VALIDEE",
          objectif: { type: "COMPETENCE" },
        },
        include: { objectif: true },
        orderBy: { objectif: { code: "asc" } },
      }),
      prisma.etapeReferent.findFirst({
        where: { referentId: referent.id, etapeId },
      }),
    ]);

    if (!chef || !etape) {
      return null;
    }

    return {
      chef,
      etape,
      justifications,
      peutValider: peutValiderEtape(
        referent.role,
        etape.niveau,
        Boolean(assignation),
      ),
    };
  }
}

function compterType(
  totaux: { type: string; _count: { id: number } }[],
  type: string,
): number {
  return totaux.find((total) => total.type === type)?._count.id ?? 0;
}
