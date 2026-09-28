import path from "path";
import os from "os";

import { describe, it, expect, beforeAll, vi } from "vitest";

import { REGLES_ICONE_ETAPE } from "@/lib/fichiers";

const DOSSIER_UPLOAD = path.join(os.tmpdir(), "flambeaux-progres-tests");

let StorageService: typeof import("@/services/storage.service").StorageService;

beforeAll(async () => {
  vi.stubEnv("UPLOAD_DIR", DOSSIER_UPLOAD);
  ({ StorageService } = await import("@/services/storage.service"));
});

describe("StorageService.resolvePath", () => {
  it("résout un fichier rangé dans le dossier d'upload", () => {
    expect(StorageService.resolvePath("justifications/preuve.pdf")).toBe(
      path.join(DOSSIER_UPLOAD, "justifications", "preuve.pdf"),
    );
  });

  it("refuse de remonter hors du dossier d'upload", () => {
    expect(() => StorageService.resolvePath("../../etc/passwd")).toThrow(
      "Chemin de fichier invalide",
    );
    expect(() =>
      StorageService.resolvePath("justifications/../../secret"),
    ).toThrow("Chemin de fichier invalide");
  });

  it("ramène un chemin absolu dans le dossier d'upload", () => {
    expect(StorageService.resolvePath("/etc/passwd")).toBe(
      path.join(DOSSIER_UPLOAD, "etc", "passwd"),
    );
  });
});

describe("StorageService.validate", () => {
  it("refuse un type de fichier non autorisé", () => {
    const svg = new File(["<svg/>"], "icone.svg", { type: "image/svg+xml" });

    expect(() => StorageService.validate(svg, REGLES_ICONE_ETAPE)).toThrow(
      "Type de fichier non autorisé",
    );
  });

  it("accepte un fichier conforme aux règles", () => {
    const png = new File(["png"], "icone.png", { type: "image/png" });

    expect(() =>
      StorageService.validate(png, REGLES_ICONE_ETAPE),
    ).not.toThrow();
  });
});
