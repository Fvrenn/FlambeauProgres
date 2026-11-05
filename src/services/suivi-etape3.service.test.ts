import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    objectif: { groupBy: vi.fn() },
    justification: { findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn() },
    chefEtapeStatut: { findMany: vi.fn() },
    etape: { findMany: vi.fn() },
    user: { findMany: vi.fn() },
  },
}));

vi.mock("@/services/etape.service", () => ({ EtapeService: {} }));

import { prisma } from "@/lib/prisma";
import { JUSTIFICATION_SUIVIE_INCLUDE } from "@/services/referent.service";
import {
  FILTRE_ETAPES_NIVEAU_3,
  SuiviEtape3Service,
} from "@/services/suivi-etape3.service";

const db = vi.mocked(prisma, true);

beforeEach(() => {
  vi.resetAllMocks();
  db.objectif.groupBy.mockResolvedValue([
    { type: "COMPETENCE", _count: { id: 1 } },
    { type: "REALISATION", _count: { id: 1 } },
  ] as never);
  db.justification.findMany.mockImplementation((async (args: {
    select?: unknown;
  }) =>
    args.select
      ? [
          { chefId: "complet", objectif: { type: "COMPETENCE" } },
          { chefId: "complet", objectif: { type: "REALISATION" } },
        ]
      : []) as never);
  db.chefEtapeStatut.findMany.mockResolvedValue([] as never);
  db.etape.findMany.mockResolvedValue([
    { id: "x1", name: "Expert Cuisine", niveau: 3 },
    { id: "f1", name: "Formateur", niveau: 3 },
  ] as never);
  db.user.findMany.mockResolvedValue([{ id: "complet" }] as never);
});

describe("FILTRE_ETAPES_NIVEAU_3", () => {
  it("couvre toute l'Étape 3 hors jalon, Experts comme profils", () => {
    expect(FILTRE_ETAPES_NIVEAU_3).toEqual({
      niveau: { gte: 3 },
      type: "BADGE",
      actif: true,
    });
  });
});

describe("SuiviEtape3Service.getEvaluations", () => {
  it("liste les réalisations soumises de toute l'Étape 3, les plus anciennes d'abord", async () => {
    await SuiviEtape3Service.getEvaluations("COMMISSION_FORMATION");

    expect(db.justification.findMany).toHaveBeenCalledWith({
      where: { etape: FILTRE_ETAPES_NIVEAU_3, statut: "SOUMISE" },
      include: JUSTIFICATION_SUIVIE_INCLUDE,
      orderBy: { soumiseAt: "asc" },
    });
  });

  it("ne laisse évaluer que la commission, l'admin reste en lecture", async () => {
    const commission = await SuiviEtape3Service.getEvaluations(
      "COMMISSION_FORMATION",
    );
    const admin = await SuiviEtape3Service.getEvaluations("ADMIN");

    expect(commission.peutEvaluer).toBe(true);
    expect(admin.peutEvaluer).toBe(false);
  });
});

describe("SuiviEtape3Service.getJustificationSuivie", () => {
  it("ne retrouve une réalisation que si elle relève de l'Étape 3", async () => {
    await SuiviEtape3Service.getJustificationSuivie("j1");

    expect(db.justification.findFirst).toHaveBeenCalledWith({
      where: { id: "j1", etape: FILTRE_ETAPES_NIVEAU_3 },
      include: JUSTIFICATION_SUIVIE_INCLUDE,
    });
  });
});

describe("SuiviEtape3Service.getDossiersAValider", () => {
  it("rattache chaque dossier complet à son étape, tous profils confondus", async () => {
    expect(await SuiviEtape3Service.getDossiersAValider()).toEqual([
      { chef: { id: "complet" }, etapeId: "x1", etapeName: "Expert Cuisine" },
      { chef: { id: "complet" }, etapeId: "f1", etapeName: "Formateur" },
    ]);
    expect(db.etape.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: FILTRE_ETAPES_NIVEAU_3 }),
    );
  });

  it("compte les dossiers à valider", async () => {
    expect(await SuiviEtape3Service.compterValidations()).toBe(2);
  });
});

describe("SuiviEtape3Service.compterEvaluations", () => {
  it("compte les réalisations soumises de l'Étape 3", async () => {
    db.justification.count.mockResolvedValue(3 as never);

    expect(await SuiviEtape3Service.compterEvaluations()).toBe(3);
    expect(db.justification.count).toHaveBeenCalledWith({
      where: { etape: FILTRE_ETAPES_NIVEAU_3, statut: "SOUMISE" },
    });
  });
});
