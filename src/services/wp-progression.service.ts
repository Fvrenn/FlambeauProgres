import type { OrigineValidation } from "@prisma/client";
import type { WpTaxonomyEntry } from "@/lib/wordpress-profile";

import { jalonsImplicites } from "@/lib/parcours";
import { prisma } from "@/lib/prisma";
import { fetchWpProgression } from "@/lib/wordpress-auth";
import { estEntreeSelectionnable } from "@/lib/wordpress-profile";
import {
  resoudreProgressionWp,
  valeursWpPourEtapes,
} from "@/lib/wordpress-progression";
import {
  ecritureProgressionActive,
  pousserProgressionVersWp,
} from "@/lib/wordpress-progression-client";

const INTERVALLE_SYNC_MS = 5 * 60 * 1000;

export type ResultatSyncProgression = {
  importees: number;
  retirees: number;
  nonReconnues: WpTaxonomyEntry[];
};

export type EtapeProgressionPlateforme = {
  id: string;
  number: string;
  name: string;
  wpValue: string | null;
  declaree: boolean;
  origine: OrigineValidation | null;
};

export type EtatProgressionPlateforme = {
  etapes: EtapeProgressionPlateforme[];
  ecritureActive: boolean;
};

export class WpProgressionService {
  static async appliquerEtapesDeclarees(
    chefId: string,
    etapeIds: string[],
  ): Promise<{ importees: number; retirees: number }> {
    const [statuts, etapes] = await Promise.all([
      prisma.chefEtapeStatut.findMany({
        where: { chefId },
        select: { id: true, etapeId: true, statut: true, origine: true },
      }),
      prisma.etape.findMany({ select: { id: true, niveau: true, type: true } }),
    ]);

    const parId = new Map(etapes.map((etape) => [etape.id, etape]));
    const declareesAvecNiveau = etapeIds
      .map((id) => parId.get(id))
      .filter((etape) => etape !== undefined)
      .map((etape) => ({ id: etape.id, niveau: etape.niveau }));
    const jalons = etapes
      .filter((etape) => etape.type === "JALON")
      .map((etape) => ({ id: etape.id, niveau: etape.niveau }));

    etapeIds = [...etapeIds, ...jalonsImplicites(declareesAvecNiveau, jalons)];

    const declarees = new Set(etapeIds);
    const existantsParEtape = new Map(
      statuts.map((statut) => [statut.etapeId, statut]),
    );

    const aCreer = etapeIds.filter(
      (etapeId) => !existantsParEtape.has(etapeId),
    );
    const aPromouvoir = statuts.filter(
      (statut) => declarees.has(statut.etapeId) && statut.statut !== "VALIDE",
    );
    const aRetirer = statuts.filter(
      (statut) =>
        statut.origine === "PLATEFORME" && !declarees.has(statut.etapeId),
    );

    if (
      aCreer.length === 0 &&
      aPromouvoir.length === 0 &&
      aRetirer.length === 0
    ) {
      return { importees: 0, retirees: 0 };
    }

    const maintenant = new Date();

    await prisma.$transaction([
      ...(aCreer.length > 0
        ? [
            prisma.chefEtapeStatut.createMany({
              data: aCreer.map((etapeId) => ({
                chefId,
                etapeId,
                statut: "VALIDE" as const,
                origine: "PLATEFORME" as const,
                valideeAt: maintenant,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),
      ...aPromouvoir.map((statut) =>
        prisma.chefEtapeStatut.update({
          where: { id: statut.id },
          data: {
            statut: "VALIDE",
            origine: "PLATEFORME",
            valideeAt: maintenant,
          },
        }),
      ),
      ...(aRetirer.length > 0
        ? [
            prisma.chefEtapeStatut.deleteMany({
              where: { id: { in: aRetirer.map((statut) => statut.id) } },
            }),
          ]
        : []),
    ]);

    return {
      importees: aCreer.length + aPromouvoir.length,
      retirees: aRetirer.length,
    };
  }

  static async synchroniser(
    chefId: string,
    entries: WpTaxonomyEntry[],
  ): Promise<ResultatSyncProgression> {
    const etapes = await prisma.etape.findMany({
      select: { id: true, name: true, wpValue: true },
    });

    const { etapeIds, nonReconnues } = resoudreProgressionWp(entries, etapes);
    const compteurs = await this.appliquerEtapesDeclarees(chefId, etapeIds);

    return { ...compteurs, nonReconnues };
  }

  static async synchroniserSiNecessaire(
    chefId: string,
    entries: WpTaxonomyEntry[],
    dernierSync: Date | null,
    maintenant: Date = new Date(),
  ): Promise<ResultatSyncProgression | null> {
    if (
      dernierSync &&
      maintenant.getTime() - dernierSync.getTime() < INTERVALLE_SYNC_MS
    ) {
      return null;
    }

    try {
      const resultat = await this.synchroniser(chefId, entries);

      await prisma.user.update({
        where: { id: chefId },
        data: { wpProgressionSyncAt: maintenant },
      });

      if (resultat.nonReconnues.length > 0) {
        console.warn(
          "Progression plateforme non reconnue:",
          resultat.nonReconnues.map((entry) => `${entry.value} ${entry.label}`),
        );
      }

      return resultat;
    } catch (error) {
      console.error("Erreur de synchronisation de la progression WP:", error);

      return null;
    }
  }

  static async getEtat(chefId: string): Promise<EtatProgressionPlateforme> {
    const [etapes, statuts] = await Promise.all([
      prisma.etape.findMany({
        orderBy: [{ niveau: "asc" }, { ordre: "asc" }],
        select: { id: true, number: true, name: true, wpValue: true },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { chefId, statut: "VALIDE" },
        select: { etapeId: true, origine: true },
      }),
    ]);

    const originesParEtape = new Map(
      statuts.map((statut) => [statut.etapeId, statut.origine]),
    );

    return {
      etapes: etapes.map((etape) => ({
        ...etape,
        declaree: originesParEtape.has(etape.id),
        origine: originesParEtape.get(etape.id) ?? null,
      })),
      ecritureActive: ecritureProgressionActive(),
    };
  }

  static async declarerSurPlateforme(
    chefId: string,
    etapeIds: string[],
  ): Promise<{ success: boolean; error?: string }> {
    const [etapes, validees, entreesActuelles] = await Promise.all([
      prisma.etape.findMany({
        select: { id: true, name: true, wpValue: true },
      }),
      prisma.chefEtapeStatut.findMany({
        where: { chefId, statut: "VALIDE", origine: "APP" },
        select: { etapeId: true },
      }),
      fetchWpProgression(),
    ]);

    if (!entreesActuelles) {
      return {
        success: false,
        error: "Impossible de lire la progression actuelle sur la plateforme.",
      };
    }

    const cibles = Array.from(
      new Set([...etapeIds, ...validees.map((statut) => statut.etapeId)]),
    );

    const { valeurs, sansCorrespondance } = valeursWpPourEtapes(cibles, etapes);

    if (sansCorrespondance.length > 0) {
      console.warn(
        "Étapes sans équivalent sur la plateforme, non transmises:",
        sansCorrespondance,
      );
    }

    const { nonReconnues } = resoudreProgressionWp(
      entreesActuelles.filter(estEntreeSelectionnable),
      etapes,
    );
    const conservees = nonReconnues.map((entry) => entry.value);

    const envoi = await pousserProgressionVersWp([
      ...new Set([...conservees, ...valeurs]),
    ]);

    if (!envoi.success) {
      return envoi;
    }

    await this.appliquerEtapesDeclarees(chefId, cibles);

    await prisma.user.update({
      where: { id: chefId },
      data: { wpProgressionSyncAt: new Date() },
    });

    return { success: true };
  }
}
