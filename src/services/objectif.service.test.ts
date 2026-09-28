import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    objectif: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { ObjectifService } from "@/services/objectif.service";

const db = vi.mocked(prisma, true);

const objectif = {
  code: "C1",
  description: "Animer un jeu",
  type: "COMPETENCE" as const,
  fichiersRequis: false,
  texteRequis: true,
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("ObjectifService", () => {
  it("rattache l'objectif créé à son étape", async () => {
    await ObjectifService.create("e1", objectif);

    expect(db.objectif.create).toHaveBeenCalledWith({
      data: { etapeId: "e1", ...objectif },
    });
  });

  it("met à jour un objectif", async () => {
    await ObjectifService.update("o1", objectif);

    expect(db.objectif.update).toHaveBeenCalledWith({
      where: { id: "o1" },
      data: objectif,
    });
  });

  it("supprime un objectif", async () => {
    await ObjectifService.remove("o1");

    expect(db.objectif.delete).toHaveBeenCalledWith({ where: { id: "o1" } });
  });
});
