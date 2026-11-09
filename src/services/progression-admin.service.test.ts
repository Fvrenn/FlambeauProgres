import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    fichier: { findMany: vi.fn() },
    justification: { deleteMany: vi.fn() },
    chefEtapeStatut: { deleteMany: vi.fn() },
  },
}));

vi.mock("@/services/storage.service", () => ({
  StorageService: { deleteFile: vi.fn() },
}));

import { prisma } from "@/lib/prisma";
import { ProgressionAdminService } from "@/services/progression-admin.service";
import { StorageService } from "@/services/storage.service";

const db = vi.mocked(prisma, true);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("ProgressionAdminService.supprimerJustification", () => {
  it("supprime la justification du chef et ses fichiers stockés", async () => {
    db.fichier.findMany.mockResolvedValue([
      { cheminFichier: "a/1.pdf" },
    ] as never);
    db.justification.deleteMany.mockResolvedValue({ count: 1 });

    const result = await ProgressionAdminService.supprimerJustification(
      "c1",
      "j1",
    );

    expect(result).toEqual({ success: true });
    expect(db.justification.deleteMany).toHaveBeenCalledWith({
      where: { id: "j1", chefId: "c1" },
    });
    expect(StorageService.deleteFile).toHaveBeenCalledWith("a/1.pdf");
  });

  it("ne touche à aucun fichier si la justification n'appartient pas au chef", async () => {
    db.fichier.findMany.mockResolvedValue([] as never);
    db.justification.deleteMany.mockResolvedValue({ count: 0 });

    const result = await ProgressionAdminService.supprimerJustification(
      "c1",
      "j2",
    );

    expect(result.success).toBe(false);
    expect(StorageService.deleteFile).not.toHaveBeenCalled();
  });
});

describe("ProgressionAdminService.reinitialiserEtape", () => {
  it("supprime les justifications et le statut de l'étape du chef", async () => {
    db.fichier.findMany.mockResolvedValue([
      { cheminFichier: "a/1.png" },
      { cheminFichier: "a/2.png" },
    ] as never);

    const result = await ProgressionAdminService.reinitialiserEtape("c1", "e1");

    expect(result).toEqual({ success: true });
    expect(db.justification.deleteMany).toHaveBeenCalledWith({
      where: { chefId: "c1", etapeId: "e1" },
    });
    expect(db.chefEtapeStatut.deleteMany).toHaveBeenCalledWith({
      where: { chefId: "c1", etapeId: "e1" },
    });
    expect(db.$transaction).toHaveBeenCalledOnce();
    expect(StorageService.deleteFile).toHaveBeenCalledTimes(2);
  });
});
