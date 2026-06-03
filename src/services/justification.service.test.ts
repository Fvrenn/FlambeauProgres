import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const prisma = {
    justification: {
      findUnique: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    etapeReferent: { findFirst: vi.fn(), findMany: vi.fn() },
    commentaire: { create: vi.fn() },
    notification: { create: vi.fn(), createMany: vi.fn() },
    objectif: { findUnique: vi.fn() },
    fichier: { create: vi.fn() },
  };

  return { default: prisma, prisma };
});

import prisma from "@/lib/prisma";
import { JustificationService } from "@/services/justification.service";

const db = vi.mocked(prisma, true);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("JustificationService.approveJustification", () => {
  it("fails when the justification is not found", async () => {
    db.justification.findUnique.mockResolvedValue(null as never);

    const result = await JustificationService.approveJustification(
      "j1",
      "ref1",
    );

    expect(result.success).toBe(false);
    expect(db.justification.update).not.toHaveBeenCalled();
  });

  it("refuses a referent who is not assigned to the etape (authz invariant)", async () => {
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      etapeId: "e1",
      chefId: "c1",
      objectif: { code: "C1", description: "desc", etape: { name: "Etape" } },
    } as never);
    db.etapeReferent.findFirst.mockResolvedValue(null as never);

    const result = await JustificationService.approveJustification(
      "j1",
      "ref1",
    );

    expect(result.success).toBe(false);
    expect(db.justification.update).not.toHaveBeenCalled();
  });

  it("validates the justification and notifies the chef on success", async () => {
    db.justification.findUnique.mockResolvedValue({
      id: "j1",
      etapeId: "e1",
      chefId: "c1",
      objectif: { code: "C1", description: "desc", etape: { name: "Etape" } },
    } as never);
    db.etapeReferent.findFirst.mockResolvedValue({ id: "a1" } as never);
    db.justification.update.mockResolvedValue({} as never);
    db.notification.create.mockResolvedValue({} as never);

    const result = await JustificationService.approveJustification(
      "j1",
      "ref1",
    );

    expect(result.success).toBe(true);
    expect(db.justification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "j1" },
        data: expect.objectContaining({ statut: "VALIDEE" }),
      }),
    );
    expect(db.notification.create).toHaveBeenCalledTimes(1);
  });
});

describe("JustificationService.submitCompetence", () => {
  it("fails when the objectif is not found", async () => {
    db.objectif.findUnique.mockResolvedValue(null as never);

    const result = await JustificationService.submitCompetence(
      "c1",
      "o1",
      "txt",
    );

    expect(result.success).toBe(false);
  });

  it("rejects an objectif that is not a COMPETENCE", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
    } as never);

    const result = await JustificationService.submitCompetence(
      "c1",
      "o1",
      "txt",
    );

    expect(result.success).toBe(false);
    expect(db.justification.create).not.toHaveBeenCalled();
  });

  it("creates an AUTO_VALIDEE justification when none exists yet", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "COMPETENCE",
      etapeId: "e1",
    } as never);
    db.justification.findFirst.mockResolvedValue(null as never);
    db.justification.create.mockResolvedValue({} as never);

    const result = await JustificationService.submitCompetence(
      "c1",
      "o1",
      "txt",
    );

    expect(result.success).toBe(true);
    expect(db.justification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          chefId: "c1",
          objectifId: "o1",
          statut: "AUTO_VALIDEE",
        }),
      }),
    );
  });

  it("updates the existing justification instead of creating a new one", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "COMPETENCE",
      etapeId: "e1",
    } as never);
    db.justification.findFirst.mockResolvedValue({ id: "j-existing" } as never);
    db.justification.update.mockResolvedValue({} as never);

    const result = await JustificationService.submitCompetence(
      "c1",
      "o1",
      "txt",
    );

    expect(result.success).toBe(true);
    expect(db.justification.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "j-existing" } }),
    );
    expect(db.justification.create).not.toHaveBeenCalled();
  });
});

describe("JustificationService.submitRealisation", () => {
  it("rejects an objectif that is not a REALISATION", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "COMPETENCE",
      etapeId: "e1",
      etape: { name: "E" },
    } as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
      fichierData: null,
    });

    expect(result.success).toBe(false);
    expect(db.justification.create).not.toHaveBeenCalled();
  });

  it("creates a SOUMISE justification and notifies the etape referents", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
      etape: { name: "E" },
    } as never);
    db.justification.findFirst.mockResolvedValue(null as never);
    db.justification.create.mockResolvedValue({ id: "j-new" } as never);
    db.etapeReferent.findMany.mockResolvedValue([
      { referent: { id: "ref1" }, etape: { name: "E" } },
    ] as never);
    db.notification.createMany.mockResolvedValue({ count: 1 } as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "txt",
      fichierData: null,
    });

    expect(result.success).toBe(true);
    expect(db.justification.create).toHaveBeenCalledTimes(1);
    expect(db.notification.createMany).toHaveBeenCalledTimes(1);
  });
});
