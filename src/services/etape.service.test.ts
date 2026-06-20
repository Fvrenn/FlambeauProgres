import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const prisma = {
    etape: { findMany: vi.fn(), findUnique: vi.fn() },
    chefEtapeStatut: { findMany: vi.fn(), upsert: vi.fn() },
    justification: { groupBy: vi.fn() },
  };

  return { default: prisma, prisma };
});

import prisma from "@/lib/prisma";
import { EtapeService } from "@/services/etape.service";

const db = vi.mocked(prisma, true);

const etapes = [
  {
    id: "af",
    number: "0",
    name: "Allume-feu",
    image_src: null,
    couleur: null,
    niveau: 0,
    type: "JALON",
    objectifs: [],
  },
  {
    id: "e1",
    number: "1",
    name: "Découvrir",
    image_src: null,
    couleur: null,
    niveau: 1,
    type: "JALON",
    objectifs: [],
  },
  {
    id: "b1",
    number: "2b",
    name: "Branche PF",
    image_src: null,
    couleur: null,
    niveau: 2,
    type: "BADGE",
    objectifs: [],
  },
];

beforeEach(() => {
  vi.resetAllMocks();
  db.etape.findMany.mockResolvedValue(etapes as never);
});

describe("EtapeService.getDashboardEtapesForChef — déverrouillage", () => {
  it("ne débloque que l'Allume-feu pour un chef sans validation", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([] as never);

    const result = await EtapeService.getDashboardEtapesForChef("c1");
    const byId = Object.fromEntries(result.map((e) => [e.id, e]));

    expect(byId.af.verrouille).toBe(false);
    expect(byId.e1.verrouille).toBe(true);
    expect(byId.b1.verrouille).toBe(true);
  });

  it("débloque l'Étape 1 une fois l'Allume-feu validé, mais pas les badges", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([{ etapeId: "af" }] as never);

    const result = await EtapeService.getDashboardEtapesForChef("c1");
    const byId = Object.fromEntries(result.map((e) => [e.id, e]));

    expect(byId.af.verrouille).toBe(false);
    expect(byId.e1.verrouille).toBe(false);
    expect(byId.b1.verrouille).toBe(true);
  });

  it("débloque les badges une fois l'Allume-feu et l'Étape 1 validés", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { etapeId: "af" },
      { etapeId: "e1" },
    ] as never);

    const result = await EtapeService.getDashboardEtapesForChef("c1");
    const byId = Object.fromEntries(result.map((e) => [e.id, e]));

    expect(byId.b1.verrouille).toBe(false);
    expect(byId.af.isValidated).toBe(true);
  });
});

describe("EtapeService.autoValiderJalon", () => {
  const jalonsOnly = [
    { id: "af", niveau: 0 },
    { id: "e1", niveau: 1 },
  ];

  it("refuse une étape qui n'est pas un jalon", async () => {
    db.etape.findUnique.mockResolvedValue({
      id: "b1",
      niveau: 2,
      type: "BADGE",
    } as never);
    db.etape.findMany.mockResolvedValue(jalonsOnly as never);
    db.chefEtapeStatut.findMany.mockResolvedValue([] as never);

    const result = await EtapeService.autoValiderJalon("c1", "b1");

    expect(result.success).toBe(false);
    expect(db.chefEtapeStatut.upsert).not.toHaveBeenCalled();
  });

  it("refuse l'Étape 1 tant que l'Allume-feu n'est pas validé", async () => {
    db.etape.findUnique.mockResolvedValue({
      id: "e1",
      niveau: 1,
      type: "JALON",
    } as never);
    db.etape.findMany.mockResolvedValue(jalonsOnly as never);
    db.chefEtapeStatut.findMany.mockResolvedValue([] as never);

    const result = await EtapeService.autoValiderJalon("c1", "e1");

    expect(result.success).toBe(false);
    expect(db.chefEtapeStatut.upsert).not.toHaveBeenCalled();
  });

  it("valide l'Allume-feu en auto-déclaré (valideeParId null) pour un chef qui débute", async () => {
    db.etape.findUnique.mockResolvedValue({
      id: "af",
      niveau: 0,
      type: "JALON",
    } as never);
    db.etape.findMany.mockResolvedValue(jalonsOnly as never);
    db.chefEtapeStatut.findMany.mockResolvedValue([] as never);
    db.chefEtapeStatut.upsert.mockResolvedValue({} as never);

    const result = await EtapeService.autoValiderJalon("c1", "af");

    expect(result.success).toBe(true);
    expect(db.chefEtapeStatut.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          statut: "VALIDE",
          valideeParId: null,
        }),
      }),
    );
  });
});
