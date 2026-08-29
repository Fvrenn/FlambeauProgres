import type { OrigineValidation, TypeEtape } from "@prisma/client";

import { STATUTS_VALIDES } from "@/lib/justification";
import {
  auMoinsUneSpecialiteValidee,
  etapeEstAccessible,
  etapeEstDebloquee,
  niveauMaxDebloque,
} from "@/lib/parcours";
import { prisma } from "@/lib/prisma";
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
    const jalons = etapes
      .filter((etape) => etape.type === "JALON")
      .map((etape) => ({ id: etape.id, niveau: etape.niveau }));
    const niveauMax = niveauMaxDebloque(jalons, etapesValidees);
    const specialiteValidee = auMoinsUneSpecialiteValidee(
      etapes,
      etapesValidees,
    );

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
      verrouille: !etapeEstAccessible(
        etape,
        niveauMax,
        specialiteValidee,
        etapesValidees,
      ),
      isValidated: etapesValidees.has(etape.id),
      origineValidation: originesParEtape.get(etape.id) ?? null,
    }));
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
    const jalons = etapes
      .filter((etape) => etape.type === "JALON")
      .map((etape) => ({ id: etape.id, niveau: etape.niveau }));
    const niveauMax = niveauMaxDebloque(jalons, etapesIdsValidees);
    const specialiteValidee = auMoinsUneSpecialiteValidee(
      etapes,
      etapesIdsValidees,
    );

    return etapes.map((etape) => ({
      ...etape,
      isValidated: etapesIdsValidees.has(etape.id),
      origineValidation: originesParEtape.get(etape.id) ?? null,
      verrouille: !etapeEstAccessible(
        etape,
        niveauMax,
        specialiteValidee,
        etapesIdsValidees,
      ),
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

    await NotificationService.createNotification({
      destinataireId: chefId,
      type: "ETAPE_COMPLETE",
      titre: "Badge validé !",
      message: `Félicitations ! Votre badge "${etape.name}" a été officiellement validé par votre référent. Vous pouvez le coudre sur votre chemise !`,
    });

    return { success: true };
  }

  static async autoValiderJalon(
    chefId: string,
    etapeId: string,
  ): Promise<ServiceResult> {
    const [etape, jalons, statutsValides] = await Promise.all([
      prisma.etape.findUnique({
        where: { id: etapeId },
        select: { id: true, niveau: true, type: true },
      }),
      prisma.etape.findMany({
        where: { type: "JALON" },
        select: { id: true, niveau: true },
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
    const niveauMax = niveauMaxDebloque(jalons, etapesValidees);

    if (!etapeEstDebloquee(etape.niveau, niveauMax)) {
      return {
        success: false,
        error: "Tu dois d'abord valider l'étape précédente",
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
