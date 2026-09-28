import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const prisma = {
    etape: { findUniqueOrThrow: vi.fn(), update: vi.fn() },
  };

  return { prisma };
});

vi.mock("@/services/storage.service", () => ({
  StorageService: {
    uploadFile: vi.fn(),
    deleteFile: vi.fn(),
    resolvePath: vi.fn(),
  },
}));

import { prisma } from "@/lib/prisma";
import { REGLES_ICONE_ETAPE } from "@/lib/fichiers";
import { StorageService } from "@/services/storage.service";
import { EtapeIconeService } from "@/services/etape-icone.service";

const db = vi.mocked(prisma, true);
const storage = vi.mocked(StorageService, true);

const icone = new File(["png"], "Mon Badge.PNG", { type: "image/png" });

describe("EtapeIconeService.replace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.uploadFile.mockResolvedValue({
      storedPath: "etapes/etape-e1-1.png",
      fileName: "etape-e1-1.png",
    });
  });

  it("stocke l'icône sous le nom de l'étape et enregistre sa route", async () => {
    db.etape.findUniqueOrThrow.mockResolvedValue({ image_src: null } as never);

    await EtapeIconeService.replace("e1", icone);

    const [fichierStocke, dossier, regles] = storage.uploadFile.mock.calls[0];

    expect(fichierStocke.name).toBe("etape-e1.png");
    expect(dossier).toBe("etapes");
    expect(regles).toBe(REGLES_ICONE_ETAPE);
    expect(db.etape.update).toHaveBeenCalledWith({
      where: { id: "e1" },
      data: { image_src: "/api/etapes/icones/etape-e1-1.png" },
    });
    expect(storage.deleteFile).not.toHaveBeenCalled();
  });

  it("supprime l'ancienne icône téléversée", async () => {
    db.etape.findUniqueOrThrow.mockResolvedValue({
      image_src: "/api/etapes/icones/etape-e1-0.png",
    } as never);

    await EtapeIconeService.replace("e1", icone);

    expect(storage.deleteFile).toHaveBeenCalledWith("etapes/etape-e1-0.png");
  });

  it("ne supprime pas une icône livrée avec l'application", async () => {
    db.etape.findUniqueOrThrow.mockResolvedValue({
      image_src: "/etapes/2c-spe_F.svg",
    } as never);

    await EtapeIconeService.replace("e1", icone);

    expect(storage.deleteFile).not.toHaveBeenCalled();
  });
});

describe("EtapeIconeService.read", () => {
  it("refuse un nom de fichier qui sort du dossier des icônes", async () => {
    expect(await EtapeIconeService.read("..%2F.env")).toBeNull();
    expect(storage.resolvePath).not.toHaveBeenCalled();
  });
});
