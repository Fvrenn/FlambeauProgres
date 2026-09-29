import type { Prisma, UserRole } from "@prisma/client";

import {
  chefsAyantToutValide,
  compterParType,
  filtreJustificationsValidantes,
  MESSAGE_AUTO_VALIDATION,
  MESSAGE_DOSSIER_INCOMPLET,
  statutValidant,
} from "@/lib/justification";
import { prisma } from "@/lib/prisma";
import {
  messageRefusValidation,
  peutEvaluerEtape,
  peutValiderEtape,
} from "@/lib/roles";
import { EtapeService } from "@/services/etape.service";
import { USER_RESUME_SELECT } from "@/services/user.service";

export type ReferentConnecte = { id: string; role: UserRole };

export const JUSTIFICATION_SUIVIE_INCLUDE = {
  chef: { select: USER_RESUME_SELECT },
  objectif: true,
  messages: { select: { auteurId: true } },
} satisfies Prisma.JustificationInclude;

export class ReferentService {
  static async getDashboard(etapeId: string, referent: ReferentConnecte) {
    const etape = await prisma.etape.findUnique({
      where: { id: etapeId },
      select: { niveau: true },
    });
    const niveau = etape?.niveau ?? 0;

    const [
      totaux,
      validations,
      badgesValides,
      justificationsAValider,
      justificationsEnAttente,
      assignation,
    ] = await Promise.all([
      prisma.objectif.groupBy({
        by: ["type"],
        where: { etapeId },
        _count: { id: true },
      }),
      prisma.justification.findMany({
        where: { etapeId, ...filtreJustificationsValidantes(niveau) },
        select: { chefId: true, objectif: { select: { type: true } } },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { etapeId, statut: "VALIDE" },
        select: { chefId: true },
      }),
      prisma.justification.findMany({
        where: { etapeId, statut: "SOUMISE" },
        include: JUSTIFICATION_SUIVIE_INCLUDE,
        orderBy: { soumiseAt: "asc" },
      }),
      prisma.justification.findMany({
        where: { etapeId, statut: "DEMANDE_PRECISION" },
        include: JUSTIFICATION_SUIVIE_INCLUDE,
        orderBy: { updatedAt: "asc" },
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
        competences: compterParType(totaux, "COMPETENCE"),
        realisations: compterParType(totaux, "REALISATION"),
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
      justificationsEnAttente,
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
    const etape = await prisma.etape.findUnique({ where: { id: etapeId } });

    if (!etape) {
      return null;
    }

    const [chef, justifications, assignation, estComplet] = await Promise.all([
      prisma.user.findUnique({
        where: { id: chefId },
        select: USER_RESUME_SELECT,
      }),
      prisma.justification.findMany({
        where: {
          chefId,
          etapeId,
          statut: statutValidant("COMPETENCE", etape.niveau),
          objectif: { type: "COMPETENCE" },
        },
        include: { objectif: true },
        orderBy: { objectif: { code: "asc" } },
      }),
      prisma.etapeReferent.findFirst({
        where: { referentId: referent.id, etapeId },
      }),
      EtapeService.estDossierComplet(chefId, etapeId),
    ]);

    if (!chef) {
      return null;
    }

    const aLeDroit = peutValiderEtape(
      referent.role,
      etape.niveau,
      Boolean(assignation),
    );
    const estSonPropreDossier = referent.id === chefId;

    return {
      chef,
      etape,
      justifications,
      peutValider: aLeDroit && !estSonPropreDossier && estComplet,
      refusValidation: !aLeDroit
        ? messageRefusValidation(etape.niveau)
        : estSonPropreDossier
          ? MESSAGE_AUTO_VALIDATION
          : MESSAGE_DOSSIER_INCOMPLET,
    };
  }
}
