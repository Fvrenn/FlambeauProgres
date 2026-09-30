import type { ServiceResult } from "@/types";
import type { OrigineValidation, TypeEtape, UserRole } from "@prisma/client";

import {
  chefsAyantToutValide,
  compterParType,
  filtreJustificationsValidantes,
  MESSAGE_AUTO_VALIDATION,
  MESSAGE_DOSSIER_INCOMPLET,
  STATUTS_VALIDES,
} from "@/lib/justification";
import {
  auMoinsUneSpecialiteValidee,
  construireContexteParcours,
  etapeEstAccessible,
  etapeEstDebloquee,
  NIVEAU_PROFILS,
  niveauMaxDebloque,
} from "@/lib/parcours";
import { prisma } from "@/lib/prisma";
import {
  estNiveauEtape3,
  messageRefusValidation,
  peutValiderEtape,
} from "@/lib/roles";
import { NotificationService } from "@/services/notification.service";

type EtapeProgressForChef = {
  id: string;
  number: string;
  name: string;
  imageSrc: string | null;
  couleur: string | null;
  niveau: number;
  type: TypeEtape;
  done: number;
  total: number;
  verrouille: boolean;
  isValidated: boolean;
  origineValidation: OrigineValidation | null;
};

export class EtapeService {
  static async getProgressForChef(
    chefId: string,
  ): Promise<EtapeProgressForChef[]> {
    const [etapes, validees, statutsValides] = await Promise.all([
      prisma.etape.findMany({
        orderBy: [{ niveau: "asc" }, { ordre: "asc" }],
        select: {
          id: true,
          number: true,
          name: true,
          image_src: true,
          couleur: true,
          niveau: true,
          type: true,
          _count: { select: { objectifs: true } },
        },
      }),
      prisma.justification.groupBy({
        by: ["etapeId"],
        where: { chefId, statut: { in: STATUTS_VALIDES } },
        _count: { id: true },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { chefId, statut: "VALIDE" },
        select: { etapeId: true, origine: true },
      }),
    ]);

    const doneByEtape = new Map(validees.map((v) => [v.etapeId, v._count.id]));
    const originesParEtape = new Map(
      statutsValides.map((s) => [s.etapeId, s.origine]),
    );
    const etapesValidees = new Set(statutsValides.map((s) => s.etapeId));
    const contexte = construireContexteParcours(etapes, etapesValidees);

    return etapes.map((etape) => ({
      id: etape.id,
      number: etape.number,
      name: etape.name,
      imageSrc: etape.image_src,
      couleur: etape.couleur,
      niveau: etape.niveau,
      type: etape.type,
      done: doneByEtape.get(etape.id) ?? 0,
      total: etape._count.objectifs,
      verrouille: !etapeEstAccessible(etape, contexte),
      isValidated: etapesValidees.has(etape.id),
      origineValidation: originesParEtape.get(etape.id) ?? null,
    }));
  }

  static async estAccessiblePourChef(
    chefId: string,
    etapeId: string,
  ): Promise<boolean> {
    const [etapes, statutsValides] = await Promise.all([
      prisma.etape.findMany({
        select: { id: true, niveau: true, type: true },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { chefId, statut: "VALIDE" },
        select: { etapeId: true },
      }),
    ]);

    const etape = etapes.find((candidate) => candidate.id === etapeId);

    if (!etape) {
      return false;
    }

    const etapesValidees = new Set(statutsValides.map((s) => s.etapeId));

    return etapeEstAccessible(
      etape,
      construireContexteParcours(etapes, etapesValidees),
    );
  }

  static async getDashboardEtapesForChef(chefId: string) {
    const [etapes, statutsValides] = await Promise.all([
      prisma.etape.findMany({
        orderBy: [{ niveau: "asc" }, { ordre: "asc" }],
        include: {
          objectifs: {
            include: { justifications: { where: { chefId } } },
          },
        },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { chefId, statut: "VALIDE" },
        select: { etapeId: true, origine: true },
      }),
    ]);

    const originesParEtape = new Map(
      statutsValides.map((s) => [s.etapeId, s.origine]),
    );
    const etapesIdsValidees = new Set(statutsValides.map((s) => s.etapeId));
    const contexte = construireContexteParcours(etapes, etapesIdsValidees);

    return etapes.map((etape) => ({
      ...etape,
      isValidated: etapesIdsValidees.has(etape.id),
      origineValidation: originesParEtape.get(etape.id) ?? null,
      verrouille: !etapeEstAccessible(etape, contexte),
    }));
  }

  static async validateBadge(input: {
    chefId: string;
    referentId: string;
    referentRole: UserRole | undefined;
    etapeId: string;
  }): Promise<ServiceResult> {
    const { chefId, referentId, referentRole, etapeId } = input;

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

    if (!peutValiderEtape(referentRole, etape.niveau, Boolean(assignation))) {
      return { success: false, error: messageRefusValidation(etape.niveau) };
    }

    if (referentId === chefId) {
      return { success: false, error: MESSAGE_AUTO_VALIDATION };
    }

    if (!(await this.estDossierComplet(chefId, etapeId))) {
      return { success: false, error: MESSAGE_DOSSIER_INCOMPLET };
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
        origine: "APP",
        valideeAt: new Date(),
        valideeParId: referentId,
      },
      create: {
        chefId: chefId,
        etapeId: etapeId,
        statut: "VALIDE",
        origine: "APP",
        valideeAt: new Date(),
        valideeParId: referentId,
      },
    });

    const validateur = estNiveauEtape3(etape.niveau)
      ? "le Coordinateur National"
      : "votre référent";

    await NotificationService.createNotification({
      destinataireId: chefId,
      type: "ETAPE_COMPLETE",
      titre: "Badge validé !",
      message: `Félicitations ! Votre badge "${etape.name}" a été officiellement validé par ${validateur}. Vous pouvez le coudre sur votre chemise !`,
    });

    return { success: true };
  }

  static async estDossierComplet(
    chefId: string,
    etapeId: string,
  ): Promise<boolean> {
    const etape = await prisma.etape.findUnique({
      where: { id: etapeId },
      select: { niveau: true },
    });

    if (!etape) {
      return false;
    }

    const [totaux, validations] = await Promise.all([
      prisma.objectif.groupBy({
        by: ["type"],
        where: { etapeId },
        _count: { id: true },
      }),
      prisma.justification.findMany({
        where: {
          chefId,
          etapeId,
          ...filtreJustificationsValidantes(etape.niveau),
        },
        select: { chefId: true, objectif: { select: { type: true } } },
      }),
    ]);

    return chefsAyantToutValide(
      validations.map(({ objectif }) => ({ chefId, type: objectif.type })),
      {
        competences: compterParType(totaux, "COMPETENCE"),
        realisations: compterParType(totaux, "REALISATION"),
      },
    ).includes(chefId);
  }

  static async autoValiderJalon(
    chefId: string,
    etapeId: string,
  ): Promise<ServiceResult> {
    const [etape, etapes, statutsValides] = await Promise.all([
      prisma.etape.findUnique({
        where: { id: etapeId },
        select: { id: true, niveau: true, type: true },
      }),
      prisma.etape.findMany({
        select: { id: true, niveau: true, type: true },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { chefId, statut: "VALIDE" },
        select: { etapeId: true },
      }),
    ]);

    if (!etape || etape.type !== "JALON") {
      return {
        success: false,
        error: "Étape introuvable ou non auto-validable",
      };
    }

    const etapesValidees = new Set(statutsValides.map((s) => s.etapeId));
    const jalons = etapes.filter((candidate) => candidate.type === "JALON");
    const niveauMax = niveauMaxDebloque(jalons, etapesValidees);

    if (!etapeEstDebloquee(etape.niveau, niveauMax)) {
      return {
        success: false,
        error: "Tu dois d'abord valider l'étape précédente",
      };
    }

    if (
      etape.niveau >= NIVEAU_PROFILS &&
      !auMoinsUneSpecialiteValidee(etapes, etapesValidees)
    ) {
      return {
        success: false,
        error: "Tu dois d'abord valider une spécialité",
      };
    }

    await prisma.chefEtapeStatut.upsert({
      where: { chefId_etapeId: { chefId, etapeId } },
      update: {
        statut: "VALIDE",
        origine: "APP",
        valideeAt: new Date(),
        valideeParId: null,
      },
      create: {
        chefId,
        etapeId,
        statut: "VALIDE",
        origine: "APP",
        valideeAt: new Date(),
        valideeParId: null,
      },
    });

    return { success: true };
  }
}
