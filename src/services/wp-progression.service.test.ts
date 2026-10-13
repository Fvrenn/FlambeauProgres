import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => {
  const prisma = {
    chefEtapeStatut: { findMany: vi.fn() },
  };

  return { prisma };
});

vi.mock("@/lib/wordpress-auth", () => ({
  fetchWpProgression: vi.fn(),
}));

vi.mock("@/lib/wordpress-progression-client", () => ({
  ecritureProgressionActive: vi.fn(),
  pousserProgressionVersWp: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import {
  ecritureProgressionActive,
  pousserProgressionVersWp,
} from "@/lib/wordpress-progression-client";
import { WpProgressionService } from "@/services/wp-progression.service";

const db = vi.mocked(prisma, true);
const ecritureActive = vi.mocked(ecritureProgressionActive);
const pousser = vi.mocked(pousserProgressionVersWp);

const etapes = [
  { id: "e101", name: "Découvrir", wpValue: "101" },
  { id: "e207", name: "Construction", wpValue: "207" },
  { id: "e3", name: "Servir", wpValue: null },
];

const entreesPlateforme = [
  { value: "101", label: "--- Découvrir" },
  { value: "999", label: "--- Inconnue" },
];

beforeEach(() => {
  vi.resetAllMocks();
  ecritureActive.mockReturnValue(true);
  pousser.mockResolvedValue({ success: true });
});

describe("WpProgressionService.envoyerValidationsManquantes", () => {
  it("envoie les étapes validées dans l'app absentes de la plateforme, en gardant les entrées existantes", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { etapeId: "e101" },
      { etapeId: "e207" },
    ] as never);

    const envoyees = await WpProgressionService.envoyerValidationsManquantes(
      "c1",
      entreesPlateforme,
      ["e101"],
      etapes,
    );

    expect(envoyees).toBe(1);
    expect(pousser).toHaveBeenCalledWith(["101", "999", "207"]);
    expect(db.chefEtapeStatut.findMany).toHaveBeenCalledWith({
      where: { chefId: "c1", statut: "VALIDE", origine: "APP" },
      select: { etapeId: true },
    });
  });

  it("n'envoie rien quand la plateforme est déjà à jour", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { etapeId: "e101" },
    ] as never);

    const envoyees = await WpProgressionService.envoyerValidationsManquantes(
      "c1",
      entreesPlateforme,
      ["e101"],
      etapes,
    );

    expect(envoyees).toBe(0);
    expect(pousser).not.toHaveBeenCalled();
  });

  it("ignore les étapes sans équivalent sur la plateforme", async () => {
    db.chefEtapeStatut.findMany.mockResolvedValue([{ etapeId: "e3" }] as never);

    const envoyees = await WpProgressionService.envoyerValidationsManquantes(
      "c1",
      entreesPlateforme,
      ["e101"],
      etapes,
    );

    expect(envoyees).toBe(0);
    expect(pousser).not.toHaveBeenCalled();
  });

  it("ne fait rien quand l'écriture est désactivée", async () => {
    ecritureActive.mockReturnValue(false);

    const envoyees = await WpProgressionService.envoyerValidationsManquantes(
      "c1",
      entreesPlateforme,
      [],
      etapes,
    );

    expect(envoyees).toBe(0);
    expect(db.chefEtapeStatut.findMany).not.toHaveBeenCalled();
    expect(pousser).not.toHaveBeenCalled();
  });

  it("renvoie 0 sans planter si la plateforme refuse", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    db.chefEtapeStatut.findMany.mockResolvedValue([
      { etapeId: "e207" },
    ] as never);
    pousser.mockResolvedValue({ success: false, error: "403" });

    const envoyees = await WpProgressionService.envoyerValidationsManquantes(
      "c1",
      entreesPlateforme,
      ["e101"],
      etapes,
    );

    expect(envoyees).toBe(0);
  });
});
