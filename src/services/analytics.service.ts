import type { UserRole } from "@prisma/client";

import {
  type AnalyticsPeriode,
  type Kpis,
  type StatComptee,
  type ValidationEvent,
  agregerParEtape,
  agregerParReferent,
  calculerKpis,
  debutPeriode,
} from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { ROLES_REFERENT } from "@/lib/roles";

type AnalyticsFiltres = {
  periode: AnalyticsPeriode;
  etapeId?: string;
  referentId?: string;
};

export type OptionFiltre = { id: string; name: string };

type AnalyticsData = {
  kpis: Kpis;
  parReferent: StatComptee[];
  parEtape: StatComptee[];
  journal: ValidationEvent[];
  etapesDisponibles: OptionFiltre[];
  referentsDisponibles: OptionFiltre[];
};

const CHAMPS_VALIDATION = {
  id: true,
  valideeAt: true,
  valideeParId: true,
  valideePar: { select: { name: true, role: true } },
  chefId: true,
  chef: { select: { name: true } },
  etapeId: true,
  etape: { select: { name: true } },
} as const;

export class AnalyticsService {
  static async getAnalytics(
    filtres: AnalyticsFiltres,
    maintenant: Date = new Date(),
  ): Promise<AnalyticsData> {
    const debut = debutPeriode(filtres.periode, maintenant);
    const filtreValidation = {
      valideeParId: filtres.referentId ?? { not: null },
      valideeAt: debut ? { gte: debut } : undefined,
      etapeId: filtres.etapeId,
    };

    const [realisations, badges, etapesDisponibles, referentsDisponibles] =
      await Promise.all([
        prisma.justification.findMany({
          where: { statut: "VALIDEE", ...filtreValidation },
          select: {
            ...CHAMPS_VALIDATION,
            objectif: { select: { code: true, description: true } },
          },
        }),
        prisma.chefEtapeStatut.findMany({
          where: { statut: "VALIDE", origine: "APP", ...filtreValidation },
          select: CHAMPS_VALIDATION,
        }),
        prisma.etape.findMany({
          orderBy: [{ niveau: "asc" }, { ordre: "asc" }],
          select: { id: true, name: true },
        }),
        prisma.user.findMany({
          where: { role: { in: ROLES_REFERENT } },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),
      ]);

    const journal: ValidationEvent[] = [
      ...realisations.map((realisation) => ({
        ...toEvenement(realisation),
        id: `r-${realisation.id}`,
        type: "REALISATION" as const,
        objet: `${realisation.objectif.code} - ${realisation.objectif.description}`,
        justificationId: realisation.id,
      })),
      ...badges.map((badge) => ({
        ...toEvenement(badge),
        id: `b-${badge.id}`,
        type: "BADGE" as const,
        objet: "Badge complet",
        justificationId: null,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      kpis: calculerKpis(journal),
      parReferent: agregerParReferent(journal),
      parEtape: agregerParEtape(journal),
      journal,
      etapesDisponibles,
      referentsDisponibles,
    };
  }
}

function toEvenement(validation: {
  valideeAt: Date | null;
  valideeParId: string | null;
  valideePar: { name: string; role: UserRole } | null;
  chefId: string;
  chef: { name: string };
  etapeId: string;
  etape: { name: string };
}) {
  return {
    date: validation.valideeAt ?? new Date(0),
    referentId: validation.valideeParId ?? "",
    referentName: validation.valideePar?.name ?? "Inconnu",
    referentRole: validation.valideePar?.role ?? "REFERENT",
    chefId: validation.chefId,
    chefName: validation.chef.name,
    etapeId: validation.etapeId,
    etapeName: validation.etape.name,
  };
}
