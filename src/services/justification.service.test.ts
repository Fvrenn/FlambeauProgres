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
    message: { create: vi.fn() },
    notification: { create: vi.fn(), createMany: vi.fn() },
    objectif: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  };

  return { default: prisma, prisma };
});

import prisma from "@/lib/prisma";
import { JustificationService } from "@/services/justification.service";

const db = vi.mocked(prisma, true);

beforeEach(() => {
  vi.resetAllMocks();
  db.$transaction.mockImplementation(async (cb: (tx: typeof db) => unknown) =>
    cb(db),
  );
  db.message.create.mockResolvedValue({ id: "m1" } as never);
  db.notification.createMany.mockResolvedValue({ count: 1 } as never);
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
    expect(db.message.create).not.toHaveBeenCalled();
  });

  it("rejects a submission with neither text nor file", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
      etape: { name: "E" },
    } as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "   ",
      fichierData: null,
    });

    expect(result.success).toBe(false);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("creates a SOUMISE justification with a first message and notifies the referents", async () => {
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

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "ma réalisation",
      fichierData: null,
    });

    expect(result.success).toBe(true);
    expect(db.justification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ statut: "SOUMISE" }),
      }),
    );
    expect(db.message.create).toHaveBeenCalledTimes(1);
    expect(db.notification.createMany).toHaveBeenCalledTimes(1);
  });

  it("re-submits an existing justification by updating it (no duplicate create)", async () => {
    db.objectif.findUnique.mockResolvedValue({
      id: "o1",
      type: "REALISATION",
      etapeId: "e1",
      etape: { name: "E" },
    } as never);
    db.justification.findFirst.mockResolvedValue({ id: "j-existing" } as never);
    db.justification.update.mockResolvedValue({ id: "j-existing" } as never);
    db.etapeReferent.findMany.mockResolvedValue([
      { referent: { id: "ref1" }, etape: { name: "E" } },
    ] as never);

    const result = await JustificationService.submitRealisation({
      chefId: "c1",
      chefName: "Chef",
      objectifId: "o1",
      contenu: "nouvelle version",
      fichierData: null,
    });

    expect(result.success).toBe(true);
    expect(db.justification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "j-existing" },
        data: expect.objectContaining({ statut: "SOUMISE" }),
      }),
    );
    expect(db.justification.create).not.toHaveBeenCalled();
    expect(db.message.create).toHaveBeenCalledTimes(1);
  });
});
