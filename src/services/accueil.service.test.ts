import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { update: vi.fn() } },
}));

vi.mock("@/lib/wordpress-auth", () => ({
  fetchWpChoix: vi.fn(),
}));

vi.mock("@/lib/wordpress-progression-client", () => ({
  ecritureProgressionActive: vi.fn(),
  pousserGroupeVersWp: vi.fn(),
}));

vi.mock("@/services/wp-progression.service", () => ({
  WpProgressionService: { getEtat: vi.fn(), declarerSurPlateforme: vi.fn() },
}));

import { prisma } from "@/lib/prisma";
import { fetchWpChoix } from "@/lib/wordpress-auth";
import {
  ecritureProgressionActive,
  pousserGroupeVersWp,
} from "@/lib/wordpress-progression-client";
import { AccueilService } from "@/services/accueil.service";
import { WpProgressionService } from "@/services/wp-progression.service";

const db = vi.mocked(prisma, true);
const choix = vi.mocked(fetchWpChoix);
const ecriture = vi.mocked(ecritureProgressionActive);
const pousserGroupe = vi.mocked(pousserGroupeVersWp);
const progression = vi.mocked(WpProgressionService, true);

const etape = (id: string, wpValue: string | null) => ({
  id,
  number: id,
  name: id,
  image_src: null,
  couleur: null,
  niveau: 2,
  wpValue,
  declaree: false,
  origine: null,
});

beforeEach(() => {
  vi.resetAllMocks();
  ecriture.mockReturnValue(true);
  choix.mockResolvedValue({
    groupe: [
      { value: "1", label: "BARR" },
      { value: "7", label: "<b>COLMAR</b>" },
    ],
    progression: [],
  });
  pousserGroupe.mockResolvedValue({ success: true });
  progression.declarerSurPlateforme.mockResolvedValue({ success: true });
});

describe("AccueilService.getEtat", () => {
  it("propose les étapes connues de la plateforme et les groupes nettoyés", async () => {
    progression.getEtat.mockResolvedValue({
      etapes: [etape("2b", "202"), etape("0", null)],
      ecritureActive: true,
    });

    const etat = await AccueilService.getEtat("u1", "7");

    expect(etat).toEqual({
      etapes: [etape("2b", "202")],
      groupes: [
        { value: "1", label: "BARR" },
        { value: "7", label: "COLMAR" },
      ],
      groupeActuel: "7",
    });
  });

  it("ne propose rien quand l'écriture vers la plateforme est coupée", async () => {
    ecriture.mockReturnValue(false);

    expect(await AccueilService.getEtat("u1", null)).toBeNull();
  });

  it("ne propose rien quand la liste des groupes est illisible", async () => {
    progression.getEtat.mockResolvedValue({ etapes: [], ecritureActive: true });
    choix.mockResolvedValue(null);

    expect(await AccueilService.getEtat("u1", null)).toBeNull();
  });
});

describe("AccueilService.terminer", () => {
  it("envoie le groupe et les étapes puis marque l'accueil terminé", async () => {
    const result = await AccueilService.terminer("u1", {
      etapeIds: ["e1"],
      groupe: "7",
    });

    expect(result).toEqual({ success: true });
    expect(pousserGroupe).toHaveBeenCalledWith("7");
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { groupe: "COLMAR" },
    });
    expect(progression.declarerSurPlateforme).toHaveBeenCalledWith("u1", [
      "e1",
    ]);
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { accueilTermineAt: expect.any(Date) },
    });
  });

  it("n'envoie que ce qui a changé", async () => {
    await AccueilService.terminer("u1", { etapeIds: null, groupe: null });

    expect(pousserGroupe).not.toHaveBeenCalled();
    expect(progression.declarerSurPlateforme).not.toHaveBeenCalled();
    expect(db.user.update).toHaveBeenCalledTimes(1);
  });

  it("refuse un groupe inconnu de la plateforme", async () => {
    const result = await AccueilService.terminer("u1", {
      etapeIds: null,
      groupe: "999",
    });

    expect(result.success).toBe(false);
    expect(pousserGroupe).not.toHaveBeenCalled();
    expect(db.user.update).not.toHaveBeenCalled();
  });

  it("laisse l'accueil ouvert si la plateforme refuse les étapes", async () => {
    progression.declarerSurPlateforme.mockResolvedValue({
      success: false,
      error: "Refus",
    });

    const result = await AccueilService.terminer("u1", {
      etapeIds: ["e1"],
      groupe: null,
    });

    expect(result).toEqual({ success: false, error: "Refus" });
    expect(db.user.update).not.toHaveBeenCalled();
  });
});
