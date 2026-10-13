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

describe("AnalyticsService.getValidationsParGroupe", () => {
  beforeEach(() => {
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { origine: "APP", chef: { groupe: "COLMAR" } },
      { origine: "PLATEFORME", chef: { groupe: "COLMAR" } },
      { origine: "PLATEFORME", chef: { groupe: null } },
    ] as never);
    db.user.findMany.mockResolvedValue([
      { groupe: "COLMAR" },
      { groupe: "BARR" },
    ] as never);
  });

  it("compte les validations app et plateforme par groupe, groupes vides compris", async () => {
    const groupes = await AnalyticsService.getValidationsParGroupe(
      { periode: "tout" },
      mardi,
    );

    expect(groupes).toEqual([
      { cle: "COLMAR", libelle: "COLMAR", app: 1, plateforme: 1 },
      { cle: "BARR", libelle: "BARR", app: 0, plateforme: 0 },
      {
        cle: "__sans-groupe",
        libelle: "Sans groupe",
        app: 0,
        plateforme: 1,
      },
    ]);
  });

  it("applique la période aux seules validations de l'app et ignore les jalons implicites de la plateforme", async () => {
    await AnalyticsService.getValidationsParGroupe(
      { periode: "30j", etapeId: "e1" },
      mardi,
    );

    expect(db.chefEtapeStatut.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          statut: "VALIDE",
          etapeId: "e1",
          OR: [
            {
              origine: "APP",
              valideeParId: { not: null },
              valideeAt: { gte: expect.any(Date) },
            },
            { origine: "PLATEFORME", etape: { wpValue: { not: null } } },
          ],
        },
      }),
    );
  });

  it("ne compte que les validations de l'app quand un référent est filtré", async () => {
    await AnalyticsService.getValidationsParGroupe(
      { periode: "tout", referentId: "r1" },
      mardi,
    );

    expect(db.chefEtapeStatut.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [{ origine: "APP", valideeParId: "r1", valideeAt: undefined }],
        }),
      }),
    );
  });
});
