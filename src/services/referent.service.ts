import type { Prisma, UserRole } from "@prisma/client";
import type { ChefAReviser } from "@/types";

import {
  chefsAyantToutValide,
  compterParType,
  filtreJustificationsValidantes,
  MESSAGE_AUTO_VALIDATION,
  MESSAGE_DOSSIER_INCOMPLET,
} from "@/lib/justification";
import { prisma } from "@/lib/prisma";
import {
  NIVEAU_ETAPE_3,
  messageRefusValidation,
  peutEvaluerEtape,
  peutValiderEtape,
} from "@/lib/roles";
import { EtapeService } from "@/services/etape.service";
import { USER_RESUME_SELECT } from "@/services/user.service";

type ReferentConnecte = { id: string; role: UserRole };

const MESSAGE_ETAPE_VALIDEE = "Cette étape est déjà validée pour ce chef";

export const JUSTIFICATION_SUIVIE_INCLUDE = {
  chef: { select: USER_RESUME_SELECT },
  etape: { select: { name: true } },
  objectif: true,
  messages: { select: { auteurId: true } },
} satisfies Prisma.JustificationInclude;

export class ReferentService {
  static async getDashboard(etapeId: string, referent: ReferentConnecte) {
    const etape = await prisma.etape.findUnique({
      where: { id: etapeId },
      select: { niveau: true, name: true },
    });
    const niveau = etape?.niveau ?? 0;

    const [
      chefsAReviser,
      justificationsAValider,
      justificationsEnAttente,
      assignation,
    ] = await Promise.all([
      chefsAReviserPourEtape({ id: etapeId, name: etape?.name ?? "", niveau }),
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

    return {
      chefsAReviser,
      justificationsAValider,
      justificationsEnAttente,
      peutEvaluer: peutEvaluerEtape(
        referent.role,
        niveau,
        Boolean(assignation),
      ),
    };
  }

  static async getDashboardExperts(referent: ReferentConnecte) {
    const [etapes, justificationsAValider, justificationsEnAttente] =
      await Promise.all([
        prisma.etape.findMany({
          where: FILTRE_ETAPES_EXPERT,
          select: { id: true, name: true, niveau: true },
        }),
        prisma.justification.findMany({
          where: { etape: FILTRE_ETAPES_EXPERT, statut: "SOUMISE" },
          include: JUSTIFICATION_SUIVIE_INCLUDE,
          orderBy: { soumiseAt: "asc" },
        }),
        prisma.justification.findMany({
          where: { etape: FILTRE_ETAPES_EXPERT, statut: "DEMANDE_PRECISION" },
          include: JUSTIFICATION_SUIVIE_INCLUDE,
          orderBy: { updatedAt: "asc" },
        }),
      ]);
    const chefsAReviser = (
      await Promise.all(etapes.map(chefsAReviserPourEtape))
    ).flat();

    return {
      chefsAReviser,
      justificationsAValider,
      justificationsEnAttente,
      peutEvaluer: peutEvaluerEtape(referent.role, NIVEAU_ETAPE_3, false),
    };
  }

  static async compterActionsExperts(referent: ReferentConnecte) {
    const { chefsAReviser, justificationsAValider, peutEvaluer } =
      await ReferentService.getDashboardExperts(referent);

    return peutEvaluer ? justificationsAValider.length : chefsAReviser.length;
  }

  static getJustificationSuivie(justificationId: string, etapeId: string) {
    return prisma.justification.findFirst({
      where: { id: justificationId, etapeId },
      include: JUSTIFICATION_SUIVIE_INCLUDE,
    });
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

    const [chef, objectifs, assignation, estComplet, estValidee] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: chefId },
          select: USER_RESUME_SELECT,
        }),
        prisma.objectif.findMany({
          where: { etapeId },
          include: { justifications: { where: { chefId } } },
          orderBy: { code: "asc" },
        }),
        prisma.etapeReferent.findFirst({
          where: { referentId: referent.id, etapeId },
        }),
        EtapeService.estDossierComplet(chefId, etapeId),
        EtapeService.estValideePourChef(chefId, etapeId),
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
      objectifs,
      estComplet,
      estValidee,
      peutValider:
        aLeDroit && !estSonPropreDossier && estComplet && !estValidee,
      refusValidation: estValidee
        ? MESSAGE_ETAPE_VALIDEE
        : !aLeDroit
          ? messageRefusValidation(etape.niveau)
          : estSonPropreDossier
            ? MESSAGE_AUTO_VALIDATION
            : MESSAGE_DOSSIER_INCOMPLET,
    };
  }
}

const FILTRE_ETAPES_EXPERT = {
  specialiteId: { not: null },
  actif: true,
} satisfies Prisma.EtapeWhereInput;

async function chefsAReviserPourEtape(etape: {
  id: string;
  name: string;
  niveau: number;
}): Promise<ChefAReviser[]> {
  const [totaux, validations, badgesValides] = await Promise.all([
    prisma.objectif.groupBy({
      by: ["type"],
      where: { etapeId: etape.id },
      _count: { id: true },
    }),
    prisma.justification.findMany({
      where: {
        etapeId: etape.id,
        ...filtreJustificationsValidantes(etape.niveau),
      },
      select: { chefId: true, objectif: { select: { type: true } } },
    }),
    prisma.chefEtapeStatut.findMany({
      where: { etapeId: etape.id, statut: "VALIDE" },
      select: { chefId: true },
    }),
  ]);

  const dejaValides = new Set(badgesValides.map(({ chefId }) => chefId));
  const chefsIds = chefsAyantToutValide(
    validations.map(({ chefId, objectif }) => ({
      chefId,
      type: objectif.type,
    })),
    {
      competences: compterParType(totaux, "COMPETENCE"),
      realisations: compterParType(totaux, "REALISATION"),
    },
  ).filter((chefId) => !dejaValides.has(chefId));

  if (chefsIds.length === 0) {
    return [];
  }

  const chefs = await prisma.user.findMany({
    where: { id: { in: chefsIds } },
    select: USER_RESUME_SELECT,
  });

  return chefs.map((chef) => ({
    chef,
    etapeId: etape.id,
    etapeName: etape.name,
  }));
}
