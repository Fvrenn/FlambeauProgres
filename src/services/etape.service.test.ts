import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const prisma = {
    etape: { findMany: vi.fn(), findUnique: vi.fn() },
    chefEtapeStatut: { findMany: vi.fn(), upsert: vi.fn() },
    justification: { groupBy: vi.fn(), findMany: vi.fn() },
    objectif: { groupBy: vi.fn() },
    user: { findUnique: vi.fn() },
    etapeReferent: { findFirst: vi.fn() },
  };

  return { prisma };
});

vi.mock("@/services/notification.service", () => ({
  NotificationService: { createNotification: vi.fn() },
}));

import { prisma } from "@/lib/prisma";
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

describe("EtapeService.getDashboardEtapesForChef - déverrouillage", () => {
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

describe("EtapeService.estAccessiblePourChef", () => {
  it("refuse une étape verrouillée", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([] as never);

    expect(await EtapeService.estAccessiblePourChef("c1", "b1")).toBe(false);
  });

  it("accepte une étape débloquée", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { etapeId: "af" },
      { etapeId: "e1" },
    ] as never);

    expect(await EtapeService.estAccessiblePourChef("c1", "b1")).toBe(true);
  });

  it("refuse une étape inexistante", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([] as never);

    expect(await EtapeService.estAccessiblePourChef("c1", "inconnue")).toBe(
      false,
    );
  });
});

describe("EtapeService.autoValiderJalon", () => {
  const catalogue = [
    { id: "af", niveau: 0, type: "JALON" },
    { id: "e1", niveau: 1, type: "JALON" },
    { id: "b1", niveau: 2, type: "BADGE" },
    { id: "servir", niveau: 3, type: "JALON" },
  ];

  it("refuse une étape qui n'est pas un jalon", async () => {
    db.etape.findUnique.mockResolvedValue({
      id: "b1",
      niveau: 2,
      type: "BADGE",
    } as never);
    db.etape.findMany.mockResolvedValue(catalogue as never);
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
    db.etape.findMany.mockResolvedValue(catalogue as never);
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
    db.etape.findMany.mockResolvedValue(catalogue as never);
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

  it("refuse le jalon Servir tant qu'aucune spécialité n'est validée", async () => {
    db.etape.findUnique.mockResolvedValue({
      id: "servir",
      niveau: 3,
      type: "JALON",
    } as never);
    db.etape.findMany.mockResolvedValue(catalogue as never);
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { etapeId: "af" },
      { etapeId: "e1" },
    ] as never);

    const result = await EtapeService.autoValiderJalon("c1", "servir");

    expect(result.success).toBe(false);
    expect(db.chefEtapeStatut.upsert).not.toHaveBeenCalled();
  });

  it("valide le jalon Servir dès qu'une spécialité est validée", async () => {
    db.etape.findUnique.mockResolvedValue({
      id: "servir",
      niveau: 3,
      type: "JALON",
    } as never);
    db.etape.findMany.mockResolvedValue(catalogue as never);
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { etapeId: "af" },
      { etapeId: "e1" },
      { etapeId: "b1" },
    ] as never);
    db.chefEtapeStatut.upsert.mockResolvedValue({} as never);

    const result = await EtapeService.autoValiderJalon("c1", "servir");

    expect(result.success).toBe(true);
    expect(db.chefEtapeStatut.upsert).toHaveBeenCalled();
  });
});

describe("EtapeService.estDossierComplet", () => {
  beforeEach(() => {
    db.objectif.groupBy.mockResolvedValue([
      { type: "COMPETENCE", _count: { id: 1 } },
      { type: "REALISATION", _count: { id: 1 } },
    ] as never);
  });

  it("exige pour l'étape 3 des compétences validées par la commission", async () => {
    db.etape.findUnique.mockResolvedValue({ niveau: 3 } as never);
    db.justification.findMany.mockResolvedValue([
      { chefId: "c1", objectif: { type: "COMPETENCE" } },
      { chefId: "c1", objectif: { type: "REALISATION" } },
    ] as never);

    expect(await EtapeService.estDossierComplet("c1", "e3")).toBe(true);
    expect(db.justification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { statut: "VALIDEE", objectif: { type: "COMPETENCE" } },
          ]),
        }),
      }),
    );
  });

  it("considère incomplet un dossier auquel il manque une réalisation", async () => {
    db.etape.findUnique.mockResolvedValue({ niveau: 2 } as never);
    db.justification.findMany.mockResolvedValue([
      { chefId: "c1", objectif: { type: "COMPETENCE" } },
    ] as never);

    expect(await EtapeService.estDossierComplet("c1", "e1")).toBe(false);
  });
});

describe("EtapeService.validateBadge", () => {
  const validation = {
    chefId: "c1",
    referentId: "cn1",
    referentRole: "COORDINATEUR_NATIONAL" as const,
    etapeId: "e3",
  };

  beforeEach(() => {
    db.etape.findUnique.mockResolvedValue({
      id: "e3",
      name: "Leader",
      niveau: 3,
    } as never);
    db.user.findUnique.mockResolvedValue({ id: "c1" } as never);
    db.etapeReferent.findFirst.mockResolvedValue(null as never);
    db.objectif.groupBy.mockResolvedValue([
      { type: "REALISATION", _count: { id: 1 } },
    ] as never);
  });

  it("refuse de valider un dossier que la commission n'a pas fini d'évaluer", async () => {
    db.justification.findMany.mockResolvedValue([] as never);

    const result = await EtapeService.validateBadge(validation);

    expect(result.success).toBe(false);
    expect(db.chefEtapeStatut.upsert).not.toHaveBeenCalled();
  });

  it("valide un dossier complet", async () => {
    db.justification.findMany.mockResolvedValue([
      { chefId: "c1", objectif: { type: "REALISATION" } },
    ] as never);

    const result = await EtapeService.validateBadge(validation);

    expect(result.success).toBe(true);
    expect(db.chefEtapeStatut.upsert).toHaveBeenCalled();
  });

  it("refuse de valider sa propre étape", async () => {
    const result = await EtapeService.validateBadge({
      ...validation,
      chefId: "cn1",
    });

    expect(result.success).toBe(false);
    expect(db.chefEtapeStatut.upsert).not.toHaveBeenCalled();
  });
});
