import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    etape: { findMany: vi.fn() },
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
      include: {
        referents: { include: { referent: { select: USER_RESUME_SELECT } } },
      },
      orderBy: { ordre: "asc" },
    });
  });

  it("assigne un référent à une étape", async () => {
    await AssignationService.assign("r1", "e1");

    expect(db.etapeReferent.create).toHaveBeenCalledWith({
      data: { referentId: "r1", etapeId: "e1" },
    });
  });

  it("retire une assignation par sa clé composite", async () => {
    await AssignationService.remove("r1", "e1");

    expect(db.etapeReferent.delete).toHaveBeenCalledWith({
      where: { referentId_etapeId: { referentId: "r1", etapeId: "e1" } },
    });
  });
});
