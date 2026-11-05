import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const prisma = {
    objectif: { groupBy: vi.fn() },
    justification: { findMany: vi.fn() },
    chefEtapeStatut: { findMany: vi.fn(), updateMany: vi.fn() },
    etape: { findMany: vi.fn() },
    user: { findMany: vi.fn() },
    remiseBadges: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  return { prisma };
});

vi.mock("@/services/etape.service", () => ({ EtapeService: {} }));

import { prisma } from "@/lib/prisma";
import { SuiviService } from "@/services/suivi.service";

const db = vi.mocked(prisma, true);
const auteurId = "coord1";

beforeEach(() => {
  vi.resetAllMocks();
  db.$transaction.mockImplementation(((
    rappel: (tx: typeof prisma) => unknown,
  ) => rappel(prisma)) as never);
  db.justification.findMany.mockResolvedValue([] as never);
  db.etape.findMany.mockResolvedValue([] as never);
});

describe("SuiviService.getEnAttente", () => {
  it("borne les listes aux étapes du référent", async () => {
    await SuiviService.getEnAttente({ etapeIds: ["e1", "e2"] });

    expect(db.justification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          statut: "SOUMISE",
          etape: { type: "BADGE", actif: true, id: { in: ["e1", "e2"] } },
        },
        orderBy: { soumiseAt: "asc" },
      }),
    );
  });

  it("couvre tous les badges actifs pour l'encadrement", async () => {
    await SuiviService.getEnAttente("tout");

    expect(db.etape.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { type: "BADGE", actif: true } }),
    );
  });

  it("ajoute le groupe de chaque chef dont le dossier est à valider", async () => {
    db.etape.findMany.mockResolvedValue([
      { id: "e1", name: "Cuisine", niveau: 2 },
    ] as never);
    db.objectif.groupBy.mockResolvedValue([
      { type: "COMPETENCE", _count: { id: 1 } },
    ] as never);
    db.justification.findMany.mockImplementation((async (args: {
      select?: { chefId?: boolean };
    }) =>
      args.select?.chefId
        ? [{ chefId: "c1", objectif: { type: "COMPETENCE" } }]
        : []) as never);
    db.chefEtapeStatut.findMany.mockResolvedValue([] as never);
    db.user.findMany.mockImplementation((async (args: {
      select: { groupe?: boolean };
    }) =>
      args.select.groupe
        ? [{ id: "c1", groupe: "COLMAR" }]
        : [{ id: "c1", name: "Jean" }]) as never);

    const { aValider } = await SuiviService.getEnAttente("tout");

    expect(aValider).toEqual([
      {
        chef: { id: "c1", name: "Jean", groupe: "COLMAR" },
        etapeId: "e1",
        etapeName: "Cuisine",
      },
    ]);
  });
});

describe("SuiviService.getARemettre", () => {
  it("ne garde que les badges validés dans l'app et pas encore remis", async () => {
    await SuiviService.getARemettre("tout");

    expect(db.chefEtapeStatut.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          statut: "VALIDE",
          origine: "APP",
          remiseId: null,
          etape: { type: "BADGE", actif: true },
        },
      }),
    );
  });
});

describe("SuiviService.getRemises", () => {
  it("ne montre au référent que les remises et badges de ses étapes", async () => {
    await SuiviService.getRemises({ etapeIds: ["e1"] });

    const args = db.remiseBadges.findMany.mock.calls[0][0] as {
      where: unknown;
      select: { badges: { where: unknown } };
    };

    expect(args.where).toEqual({
      badges: { some: { etapeId: { in: ["e1"] } } },
    });
    expect(args.select.badges.where).toEqual({ etapeId: { in: ["e1"] } });
  });
});

describe("SuiviService.marquerRemis", () => {
  it("crée la remise et y rattache les badges", async () => {
    db.remiseBadges.create.mockResolvedValue({ id: "r1" } as never);
    db.chefEtapeStatut.updateMany.mockResolvedValue({ count: 2 } as never);

    const resultat = await SuiviService.marquerRemis({
      statutIds: ["s1", "s2"],
      remise: { nom: "AG 2026", date: new Date("2026-11-21") },
      auteurId,
    });

    expect(resultat).toEqual({
      success: true,
      data: { remiseId: "r1", nombre: 2 },
    });
    expect(db.remiseBadges.create).toHaveBeenCalledWith({
      data: {
        nom: "AG 2026",
        date: new Date("2026-11-21"),
        creeParId: auteurId,
      },
      select: { id: true },
    });
    expect(db.chefEtapeStatut.updateMany).toHaveBeenCalledWith({
      where: {
        statut: "VALIDE",
        origine: "APP",
        remiseId: null,
        id: { in: ["s1", "s2"] },
        etape: { type: "BADGE" },
      },
      data: { remiseId: "r1" },
    });
  });

  it("annule tout si un badge n'est plus à remettre", async () => {
    db.remiseBadges.findUnique.mockResolvedValue({ id: "r1" } as never);
    db.chefEtapeStatut.updateMany.mockResolvedValue({ count: 1 } as never);

    const resultat = await SuiviService.marquerRemis({
      statutIds: ["s1", "s2"],
      remise: { remiseId: "r1" },
      auteurId,
    });

    expect(resultat.success).toBe(false);
  });

  it("refuse une remise qui n'existe pas", async () => {
    db.remiseBadges.findUnique.mockResolvedValue(null as never);

    const resultat = await SuiviService.marquerRemis({
      statutIds: ["s1"],
      remise: { remiseId: "inconnue" },
      auteurId,
    });

    expect(resultat).toEqual({ success: false, error: "Remise introuvable." });
    expect(db.chefEtapeStatut.updateMany).not.toHaveBeenCalled();
  });
});

describe("SuiviService.retirerDeRemise", () => {
  it("remet le badge dans la liste à remettre", async () => {
    db.chefEtapeStatut.updateMany.mockResolvedValue({ count: 1 } as never);

    expect(await SuiviService.retirerDeRemise("s1")).toEqual({
      success: true,
    });
    expect(db.chefEtapeStatut.updateMany).toHaveBeenCalledWith({
      where: { id: "s1", remiseId: { not: null } },
      data: { remiseId: null },
    });
  });
});
