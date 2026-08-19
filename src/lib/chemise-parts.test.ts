import { describe, expect, it } from "vitest";

import {
  evaluerAvancementBarettes,
  getBaretteVisibility,
  getChemiseVisibility,
  toSceneNodeName,
} from "@/lib/chemise-parts";

const allumeFeu = { number: "0", type: "JALON" };
const decouvrir = { number: "1", type: "JALON" };
const brancheFlambeaux = { number: "2c", type: "BADGE" };
const brancheePetitsFlambeaux = { number: "2b", type: "BADGE" };

describe("evaluerAvancementBarettes", () => {
  it("ne valide rien tant que Decouvrir n'est pas validee", () => {
    expect(
      evaluerAvancementBarettes([
        { ...allumeFeu, isValidated: true },
        { ...decouvrir, isValidated: false },
        { ...brancheFlambeaux, isValidated: false },
      ]),
    ).toEqual({ etape1Validee: false, etape2Validee: false });
  });

  it("valide l'etape 1 quand le jalon Decouvrir est validee", () => {
    expect(
      evaluerAvancementBarettes([
        { ...allumeFeu, isValidated: true },
        { ...decouvrir, isValidated: true },
        { ...brancheFlambeaux, isValidated: false },
      ]),
    ).toEqual({ etape1Validee: true, etape2Validee: false });
  });

  it("valide l'etape 2 des qu'un badge est validee", () => {
    expect(
      evaluerAvancementBarettes([
        { ...decouvrir, isValidated: true },
        { ...brancheePetitsFlambeaux, isValidated: false },
        { ...brancheFlambeaux, isValidated: true },
      ]),
    ).toEqual({ etape1Validee: true, etape2Validee: true });
  });

  it("ne valide pas l'etape 2 sans l'etape 1, meme avec un badge validee", () => {
    expect(
      evaluerAvancementBarettes([
        { ...decouvrir, isValidated: false },
        { ...brancheFlambeaux, isValidated: true },
      ]),
    ).toEqual({ etape1Validee: false, etape2Validee: false });
  });

  it("ignore le jalon Allume-feu", () => {
    expect(
      evaluerAvancementBarettes([{ ...allumeFeu, isValidated: true }]),
    ).toEqual({ etape1Validee: false, etape2Validee: false });
  });

  it("gere une liste vide", () => {
    expect(evaluerAvancementBarettes([])).toEqual({
      etape1Validee: false,
      etape2Validee: false,
    });
  });
});

describe("getBaretteVisibility", () => {
  it("sanitise le point de Etape 1.001 comme le GLTFLoader", () => {
    expect(toSceneNodeName("Etape 1.001")).toBe("Etape_1001");
  });

  it("masque les deux barettes avant l'etape 1", () => {
    const visibility = getBaretteVisibility(false, false);

    expect(visibility.get("Etape_1")).toBe(false);
    expect(visibility.get("Etape_2")).toBe(false);
  });

  it("affiche la premiere barette apres l'etape 1", () => {
    const visibility = getBaretteVisibility(true, false);

    expect(visibility.get("Etape_1")).toBe(true);
    expect(visibility.get("Etape_2")).toBe(false);
  });

  it("affiche les deux barettes apres un badge d'etape 2", () => {
    const visibility = getBaretteVisibility(true, true);

    expect(visibility.get("Etape_1")).toBe(true);
    expect(visibility.get("Etape_2")).toBe(true);
  });

  it("garde le doublon Blender Etape 1.001 toujours masque", () => {
    for (const etat of [
      [false, false],
      [true, false],
      [true, true],
    ] as const) {
      expect(getBaretteVisibility(etat[0], etat[1]).get("Etape_1001")).toBe(
        false,
      );
    }
  });
});

describe("getChemiseVisibility", () => {
  it("couvre les 4 epaulettes et les 3 barettes", () => {
    const visibility = getChemiseVisibility("PF", true, true);

    expect(visibility.size).toBe(7);
    expect(visibility.get("Epaulette_branche_PF_droite")).toBe(true);
    expect(visibility.get("Epaulette_branche_F_droite")).toBe(false);
    expect(visibility.get("Etape_1")).toBe(true);
    expect(visibility.get("Etape_2")).toBe(true);
    expect(visibility.get("Etape_1001")).toBe(false);
  });

  it("ne laisse aucun noeud gere hors de la map", () => {
    const visibility = getChemiseVisibility(null, false, false);

    expect([...visibility.values()].every((v) => v === false)).toBe(true);
  });
});
