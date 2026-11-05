import type { Prisma } from "@prisma/client";
import type { ServiceResult } from "@/types";

import { prisma } from "@/lib/prisma";
import { chefsAReviserPourEtape } from "@/services/referent.service";
import { USER_RESUME_SELECT } from "@/services/user.service";

export type PerimetreSuivi = "tout" | { etapeIds: string[] };

export type RemiseCible = { remiseId: string } | { nom: string; date: Date };

const CHEF_SUIVI_SELECT = {
  ...USER_RESUME_SELECT,
  groupe: true,
} as const satisfies Prisma.UserSelect;

const ETAPE_SUIVI_SELECT = {
  id: true,
  name: true,
  niveau: true,
} as const satisfies Prisma.EtapeSelect;

const JUSTIFICATION_SUIVI_SELECT = {
  id: true,
  soumiseAt: true,
  updatedAt: true,
  chef: { select: CHEF_SUIVI_SELECT },
  etape: { select: ETAPE_SUIVI_SELECT },
  objectif: { select: { code: true, description: true, type: true } },
} as const satisfies Prisma.JustificationSelect;

const BADGE_A_REMETTRE = {
  statut: "VALIDE",
  origine: "APP",
  remiseId: null,
} as const satisfies Prisma.ChefEtapeStatutWhereInput;

const MESSAGE_BADGES_PLUS_A_REMETTRE =
  "Certains badges ne sont plus à remettre : rechargez la page.";

const MESSAGE_REMISE_INTROUVABLE = "Remise introuvable.";

export class SuiviService {
  static async getEnAttente(perimetre: PerimetreSuivi) {
    const etape = filtreEtapes(perimetre);
    const [aEvaluer, enAttenteDuChef, etapes] = await Promise.all([
      prisma.justification.findMany({
        where: { statut: "SOUMISE", etape },
        select: JUSTIFICATION_SUIVI_SELECT,
        orderBy: { soumiseAt: "asc" },
      }),
      prisma.justification.findMany({
        where: { statut: "DEMANDE_PRECISION", etape },
        select: JUSTIFICATION_SUIVI_SELECT,
        orderBy: { updatedAt: "asc" },
      }),
      prisma.etape.findMany({
        where: etape,
        select: ETAPE_SUIVI_SELECT,
        orderBy: [{ niveau: "asc" }, { ordre: "asc" }],
      }),
    ]);

    const dossiers = (
      await Promise.all(etapes.map(chefsAReviserPourEtape))
    ).flat();
    const groupes = await groupesDesChefs(dossiers.map(({ chef }) => chef.id));

    return {
      etapes,
      aEvaluer,
      enAttenteDuChef,
      aValider: dossiers.map((dossier) => ({
        ...dossier,
        chef: { ...dossier.chef, groupe: groupes.get(dossier.chef.id) ?? null },
      })),
    };
  }

  static getARemettre(perimetre: PerimetreSuivi) {
    return prisma.chefEtapeStatut.findMany({
      where: { ...BADGE_A_REMETTRE, etape: filtreEtapes(perimetre) },
      select: {
        id: true,
        valideeAt: true,
        chef: { select: CHEF_SUIVI_SELECT },
        etape: { select: { ...ETAPE_SUIVI_SELECT, image_src: true } },
        valideePar: { select: { name: true } },
      },
      orderBy: { valideeAt: "asc" },
    });
  }

  static getRemises(perimetre: PerimetreSuivi) {
    const badges =
      perimetre === "tout" ? {} : { etapeId: { in: perimetre.etapeIds } };

    return prisma.remiseBadges.findMany({
      where: perimetre === "tout" ? {} : { badges: { some: badges } },
      select: {
        id: true,
        nom: true,
        date: true,
        creePar: { select: { name: true } },
        badges: {
          where: badges,
          select: {
            id: true,
            chef: { select: CHEF_SUIVI_SELECT },
            etape: { select: ETAPE_SUIVI_SELECT },
          },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  static getRemisesExistantes() {
    return prisma.remiseBadges.findMany({
      select: { id: true, nom: true, date: true },
      orderBy: { date: "desc" },
    });
  }

  static async marquerRemis(input: {
    statutIds: string[];
    remise: RemiseCible;
    auteurId: string;
  }): Promise<ServiceResult<{ remiseId: string; nombre: number }>> {
    const { statutIds, remise, auteurId } = input;

    try {
      return await prisma.$transaction(async (tx) => {
        const cible =
          "remiseId" in remise
            ? await tx.remiseBadges.findUnique({
                where: { id: remise.remiseId },
                select: { id: true },
              })
            : await tx.remiseBadges.create({
                data: {
                  nom: remise.nom,
                  date: remise.date,
                  creeParId: auteurId,
                },
                select: { id: true },
              });

        if (!cible) {
          throw new RefusRemise(MESSAGE_REMISE_INTROUVABLE);
        }

        const remiseId = cible.id;

        const { count } = await tx.chefEtapeStatut.updateMany({
          where: {
            ...BADGE_A_REMETTRE,
            id: { in: statutIds },
            etape: { type: "BADGE" },
          },
          data: { remiseId },
        });

        if (count !== statutIds.length) {
          throw new RefusRemise(MESSAGE_BADGES_PLUS_A_REMETTRE);
        }

        return { success: true as const, data: { remiseId, nombre: count } };
      });
    } catch (error) {
      if (error instanceof RefusRemise) {
        return { success: false, error: error.message };
      }

      throw error;
    }
  }

  static async retirerDeRemise(statutId: string): Promise<ServiceResult> {
    const { count } = await prisma.chefEtapeStatut.updateMany({
      where: { id: statutId, remiseId: { not: null } },
      data: { remiseId: null },
    });

    return count === 1
      ? { success: true }
      : { success: false, error: "Ce badge n'est rattaché à aucune remise." };
  }

  static async supprimerRemise(remiseId: string): Promise<ServiceResult> {
    const { count } = await prisma.remiseBadges.deleteMany({
      where: { id: remiseId },
    });

    return count === 1
      ? { success: true }
      : { success: false, error: MESSAGE_REMISE_INTROUVABLE };
  }
}

class RefusRemise extends Error {}

function filtreEtapes(perimetre: PerimetreSuivi): Prisma.EtapeWhereInput {
  return {
    type: "BADGE",
    actif: true,
    ...(perimetre !== "tout" && { id: { in: perimetre.etapeIds } }),
  };
}

async function groupesDesChefs(
  chefIds: string[],
): Promise<Map<string, string | null>> {
  if (chefIds.length === 0) {
    return new Map();
  }

  const chefs = await prisma.user.findMany({
    where: { id: { in: [...new Set(chefIds)] } },
    select: { id: true, groupe: true },
  });

  return new Map(chefs.map(({ id, groupe }) => [id, groupe]));
}
