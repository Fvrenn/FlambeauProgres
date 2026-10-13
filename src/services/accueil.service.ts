import type { EtapeProgressionPlateforme } from "@/services/wp-progression.service";

import { prisma } from "@/lib/prisma";
import { fetchWpChoix } from "@/lib/wordpress-auth";
import { nettoyerLibelleWp } from "@/lib/wordpress-profile";
import {
  ecritureProgressionActive,
  pousserGroupeVersWp,
} from "@/lib/wordpress-progression-client";
import { WpProgressionService } from "@/services/wp-progression.service";

export type GroupePlateforme = { value: string; label: string };

export type EtatAccueil = {
  etapes: EtapeProgressionPlateforme[];
  groupes: GroupePlateforme[];
  groupeActuel: string | null;
};

export type ReponsesAccueil = {
  etapeIds: string[] | null;
  groupe: string | null;
};

type Resultat = { success: boolean; error?: string };

async function listerGroupes(): Promise<GroupePlateforme[] | null> {
  const choix = await fetchWpChoix();

  return (
    choix?.groupe.map((groupe) => ({
      value: String(groupe.value),
      label: nettoyerLibelleWp(groupe.label),
    })) ?? null
  );
}

export class AccueilService {
  static async getEtat(
    userId: string,
    groupeActuel: string | null,
  ): Promise<EtatAccueil | null> {
    if (!ecritureProgressionActive()) {
      return null;
    }

    const [progression, groupes] = await Promise.all([
      WpProgressionService.getEtat(userId),
      listerGroupes(),
    ]);

    if (!groupes) {
      return null;
    }

    return {
      etapes: progression.etapes.filter((etape) => etape.wpValue !== null),
      groupes,
      groupeActuel,
    };
  }

  static async terminer(
    userId: string,
    { etapeIds, groupe }: ReponsesAccueil,
  ): Promise<Resultat> {
    if (groupe !== null) {
      const envoiGroupe = await this.changerGroupe(userId, groupe);

      if (!envoiGroupe.success) {
        return envoiGroupe;
      }
    }

    if (etapeIds !== null) {
      const envoiEtapes = await WpProgressionService.declarerSurPlateforme(
        userId,
        etapeIds,
      );

      if (!envoiEtapes.success) {
        return envoiEtapes;
      }
    }

    await this.passer(userId);

    return { success: true };
  }

  static async passer(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { accueilTermineAt: new Date() },
    });
  }

  private static async changerGroupe(
    userId: string,
    valeur: string,
  ): Promise<Resultat> {
    const groupes = await listerGroupes();
    const groupe = groupes?.find((candidat) => candidat.value === valeur);

    if (!groupe) {
      return { success: false, error: "Groupe inconnu de la plateforme." };
    }

    const envoi = await pousserGroupeVersWp(groupe.value);

    if (!envoi.success) {
      return envoi;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { groupe: groupe.label },
    });

    return { success: true };
  }
}
