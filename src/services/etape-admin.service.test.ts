import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    etape: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { EtapeAdminService } from "@/services/etape-admin.service";

const db = vi.mocked(prisma, true);

const info = {
  number: "2b",
  name: "Branche Petits Flambeaux",
  description: "Spécialité",
  ordre: 1,
  wpValue: "202",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("EtapeAdminService", () => {
  it("crée l'étape avec ses objectifs initiaux en une seule écriture", async () => {
    const objectifs = [
      {
        code: "C1",
        description: "Animer",
        type: "COMPETENCE" as const,
        fichiersRequis: false,
        texteRequis: true,
      },
    ];

    await EtapeAdminService.create(info, objectifs);

    expect(db.etape.create).toHaveBeenCalledWith({
      data: { ...info, objectifs: { create: objectifs } },
      select: { id: true },
    });
  });

  it("ne liste que les badges, pas les jalons", async () => {
    await EtapeAdminService.list();

    expect(db.etape.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { type: "BADGE" } }),
    );
  });

  it("charge les objectifs triés par code", async () => {
    await EtapeAdminService.getWithObjectifs("e1");

    expect(db.etape.findUnique).toHaveBeenCalledWith({
      where: { id: "e1" },
      include: { objectifs: { orderBy: { code: "asc" } } },
    });
  });

  it("efface la couleur quand elle est retirée", async () => {
    await EtapeAdminService.updateCouleur("e1", null);

    expect(db.etape.update).toHaveBeenCalledWith({
      where: { id: "e1" },
      data: { couleur: null },
    });
  });
});
