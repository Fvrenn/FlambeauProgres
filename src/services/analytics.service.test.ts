import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    justification: { findMany: vi.fn() },
    chefEtapeStatut: { findMany: vi.fn() },
    etape: { findMany: vi.fn() },
    user: { findMany: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { AnalyticsService } from "@/services/analytics.service";

const db = vi.mocked(prisma, true);

const lundi = new Date("2026-09-28T10:00:00Z");
const mardi = new Date("2026-09-29T10:00:00Z");

beforeEach(() => {
  vi.resetAllMocks();
  db.justification.findMany.mockResolvedValue([
    {
      id: "j1",
      valideeAt: lundi,
      valideeParId: "r1",
      valideePar: { name: "Référent", role: "REFERENT" },
      chefId: "c1",
      chef: { name: "Chef" },
      etapeId: "e1",
      etape: { name: "Cuisine" },
      objectif: { code: "R1", description: "Un repas" },
    },
  ] as never);
  db.chefEtapeStatut.findMany.mockResolvedValue([
    {
      id: "s1",
      valideeAt: mardi,
      valideeParId: "r1",
      valideePar: { name: "Référent", role: "REFERENT" },
      chefId: "c1",
      chef: { name: "Chef" },
      etapeId: "e1",
      etape: { name: "Cuisine" },
    },
  ] as never);
  db.etape.findMany.mockResolvedValue([] as never);
  db.user.findMany.mockResolvedValue([] as never);
});

describe("AnalyticsService.getAnalytics", () => {
  it("construit le journal des réalisations et badges, du plus récent au plus ancien", async () => {
    const { journal } = await AnalyticsService.getAnalytics(
      { periode: "tout" },
      mardi,
    );

    expect(journal).toEqual([
      {
        id: "b-s1",
        type: "BADGE",
        date: mardi,
        referentId: "r1",
        referentName: "Référent",
        referentRole: "REFERENT",
        chefId: "c1",
        chefName: "Chef",
        etapeId: "e1",
        etapeName: "Cuisine",
        objet: "Badge complet",
        justificationId: null,
      },
      {
        id: "r-j1",
        type: "REALISATION",
        date: lundi,
        referentId: "r1",
        referentName: "Référent",
        referentRole: "REFERENT",
        chefId: "c1",
        chefName: "Chef",
        etapeId: "e1",
        etapeName: "Cuisine",
        objet: "R1 - Un repas",
        justificationId: "j1",
      },
    ]);
  });

  it("ne compte que les badges validés dans l'app, avec les mêmes filtres que les réalisations", async () => {
    await AnalyticsService.getAnalytics(
      { periode: "tout", referentId: "r1", etapeId: "e1" },
      mardi,
    );

    const filtre = { valideeParId: "r1", etapeId: "e1" };

    expect(db.justification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ statut: "VALIDEE", ...filtre }),
      }),
    );
    expect(db.chefEtapeStatut.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          statut: "VALIDE",
          origine: "APP",
          ...filtre,
        }),
      }),
    );
  });
});
