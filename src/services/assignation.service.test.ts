import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    etape: { findMany: vi.fn(), findUnique: vi.fn() },
    etapeReferent: { create: vi.fn(), delete: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { USER_RESUME_SELECT } from "@/services/user.service";
import { AssignationService } from "@/services/assignation.service";

const db = vi.mocked(prisma, true);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("AssignationService", () => {
  it("ne charge que le résumé de chaque référent assigné", async () => {
    await AssignationService.listEtapesAvecReferents();

    expect(db.etape.findMany).toHaveBeenCalledWith({
      where: { type: "BADGE", niveau: { lt: 3 } },
      include: {
        referents: { include: { referent: { select: USER_RESUME_SELECT } } },
      },
      orderBy: { ordre: "asc" },
    });
  });

  it("assigne un référent à un badge de niveau 2", async () => {
    db.etape.findUnique.mockResolvedValue({
      type: "BADGE",
      niveau: 2,
    } as never);

    expect(await AssignationService.assign("r1", "e1")).toEqual({
      success: true,
    });

    expect(db.etapeReferent.create).toHaveBeenCalledWith({
      data: { referentId: "r1", etapeId: "e1" },
    });
  });

  it("refuse d'assigner un référent à l'étape 3", async () => {
    db.etape.findUnique.mockResolvedValue({
      type: "BADGE",
      niveau: 3,
    } as never);

    const result = await AssignationService.assign("r1", "e3");

    expect(result.success).toBe(false);
    expect(db.etapeReferent.create).not.toHaveBeenCalled();
  });

  it("refuse d'assigner un référent à un jalon", async () => {
    db.etape.findUnique.mockResolvedValue({
      type: "JALON",
      niveau: 0,
    } as never);

    expect((await AssignationService.assign("r1", "af")).success).toBe(false);
  });

  it("retire une assignation par sa clé composite", async () => {
    await AssignationService.remove("r1", "e1");

    expect(db.etapeReferent.delete).toHaveBeenCalledWith({
      where: { referentId_etapeId: { referentId: "r1", etapeId: "e1" } },
    });
  });
});
