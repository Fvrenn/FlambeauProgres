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

export type AnalyticsFiltres = {
  periode: AnalyticsPeriode;
  etapeId?: string;
  referentId?: string;
};

export type OptionFiltre = { id: string; name: string };

export type AnalyticsData = {
  kpis: Kpis;
  parReferent: StatComptee[];
  parEtape: StatComptee[];
  journal: ValidationEvent[];
  etapesDisponibles: OptionFiltre[];
  referentsDisponibles: OptionFiltre[];
};

export class AnalyticsService {
  static async getAnalytics(
    filtres: AnalyticsFiltres,
    maintenant: Date = new Date(),
  ): Promise<AnalyticsData> {
    const debut = debutPeriode(filtres.periode, maintenant);
    const filtreDate = debut ? { gte: debut } : undefined;

    const [realisations, badges, etapesDisponibles, referentsDisponibles] =
      await Promise.all([
        prisma.justification.findMany({
          where: {
            statut: "VALIDEE",
            valideeParId: filtres.referentId ?? { not: null },
            valideeAt: filtreDate,
            etapeId: filtres.etapeId,
          },
          select: {
            id: true,
            valideeAt: true,
            valideeParId: true,
            valideePar: { select: { name: true, role: true } },
            chefId: true,
            chef: { select: { name: true } },
            etapeId: true,
            etape: { select: { name: true } },
            objectif: { select: { code: true, description: true } },
          },
        }),
        prisma.chefEtapeStatut.findMany({
          where: {
            statut: "VALIDE",
            valideeParId: filtres.referentId ?? { not: null },
            valideeAt: filtreDate,
            etapeId: filtres.etapeId,
          },
          select: {
            id: true,
            valideeAt: true,
            valideeParId: true,
            valideePar: { select: { name: true, role: true } },
            chefId: true,
            chef: { select: { name: true } },
            etapeId: true,
            etape: { select: { name: true } },
          },
        }),
        prisma.etape.findMany({
          orderBy: [{ niveau: "asc" }, { ordre: "asc" }],
          select: { id: true, name: true },
        }),
        prisma.user.findMany({
          where: { role: { in: ["REFERENT", "ADMIN"] } },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),
      ]);

    const journal: ValidationEvent[] = [
      ...realisations.map((realisation) => ({
        id: `r-${realisation.id}`,
        type: "REALISATION" as const,
        date: realisation.valideeAt ?? new Date(0),
        referentId: realisation.valideeParId ?? "",
        referentName: realisation.valideePar?.name ?? "Inconnu",
        referentRole: (realisation.valideePar?.role ?? "REFERENT") as UserRole,
        chefId: realisation.chefId,
        chefName: realisation.chef.name,
        etapeId: realisation.etapeId,
        etapeName: realisation.etape.name,
        objet: `${realisation.objectif.code} - ${realisation.objectif.description}`,
        justificationId: realisation.id,
      })),
      ...badges.map((badge) => ({
        id: `b-${badge.id}`,
        type: "BADGE" as const,
        date: badge.valideeAt ?? new Date(0),
        referentId: badge.valideeParId ?? "",
        referentName: badge.valideePar?.name ?? "Inconnu",
        referentRole: (badge.valideePar?.role ?? "REFERENT") as UserRole,
        chefId: badge.chefId,
        chefName: badge.chef.name,
        etapeId: badge.etapeId,
        etapeName: badge.etape.name,
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
