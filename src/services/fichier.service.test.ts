import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { fichier: { findUnique: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";
import { FichierService } from "@/services/fichier.service";

const db = vi.mocked(prisma, true);

describe("FichierService.getById", () => {
  it("ne lit que ce qu'il faut pour contrôler l'accès et servir le fichier", async () => {
    await FichierService.getById("f1");

    expect(db.fichier.findUnique).toHaveBeenCalledWith({
      where: { id: "f1" },
      select: {
        justificationId: true,
        cheminFichier: true,
        mimeType: true,
        nomOriginal: true,
      },
    });
  });
});
