import { prisma } from "@/lib/prisma";
import { FILTRE_ETAPES_PAR_ASSIGNATION, ROLES_ADMIN } from "@/lib/roles";

export type AdminDashboardStats = {
  chefs: number;
  referents: number;
  admins: number;
  etapes: number;
  objectifs: number;
  formations: number;
  etapesSansReferent: number;
  justificationsEnAttente: number;
};

export class AdminDashboardService {
  static async getStats(): Promise<AdminDashboardStats> {
    const [
      chefs,
      referents,
      admins,
      etapes,
      objectifs,
      formations,
      etapesSansReferent,
      justificationsEnAttente,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CHEF" } }),
      prisma.user.count({ where: { role: "REFERENT" } }),
      prisma.user.count({ where: { role: { in: ROLES_ADMIN } } }),
      prisma.etape.count({ where: { type: "BADGE" } }),
      prisma.objectif.count(),
      prisma.formationCard.count(),
      prisma.etape.count({
        where: { referents: { none: {} }, ...FILTRE_ETAPES_PAR_ASSIGNATION },
      }),
      prisma.justification.count({ where: { statut: "SOUMISE" } }),
    ]);

    return {
      chefs,
      referents,
      admins,
      etapes,
      objectifs,
      formations,
      etapesSansReferent,
      justificationsEnAttente,
    };
  }
}
