import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { count: vi.fn() },
    etape: { count: vi.fn() },
    objectif: { count: vi.fn() },
    formationCard: { count: vi.fn() },
    justification: { count: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { AdminDashboardService } from "@/services/admin-dashboard.service";

const db = vi.mocked(prisma, true);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("AdminDashboardService.getStats", () => {
  it("regroupe les compteurs de la plateforme", async () => {
    db.user.count
      .mockResolvedValueOnce(40)
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(2);
    db.etape.count.mockResolvedValueOnce(14).mockResolvedValueOnce(1);
    db.objectif.count.mockResolvedValue(111);
    db.formationCard.count.mockResolvedValue(5);
    db.justification.count.mockResolvedValue(3);

    expect(await AdminDashboardService.getStats()).toEqual({
      chefs: 40,
      referents: 6,
      admins: 2,
      etapes: 14,
      objectifs: 111,
      formations: 5,
      etapesSansReferent: 1,
      justificationsEnAttente: 3,
    });
  });

  it("ne compte comme sans référent que les étapes qui en ont besoin", async () => {
    await AdminDashboardService.getStats();

    expect(db.etape.count).toHaveBeenCalledWith({
      where: { referents: { none: {} }, niveau: { lt: 3 } },
    });
  });
});
