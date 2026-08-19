import { describe, expect, it } from "vitest";

import {
  detectBranche,
  getWpProfile,
  normalizeWpLabel,
  parseWpProfile,
} from "./wordpress-profile";

import {
  evaluerAvancementBarettes,
  getBaretteVisibility,
  getChemiseVisibility,
  getEpauletteVisibility,
  toSceneNodeName,
} from "@/lib/chemise-parts";

const progressionReelle = [
  { value: "1", label: "<b>Étape 1</b>" },
  { value: "101", label: "--- Étape 1" },
  { value: "2", label: "<b>Étape 2</b>" },
  { value: "203", label: "--- Branche Flambeaux" },
];

const payloadChefFlambeaux = {
  group: "MARNE ET MORIN",
  fonction: [
    { value: "103", label: "--- Chef Flbx" },
    { value: "301", label: "--- Membre Équipe Régionale" },
  ],
  progression: progressionReelle,
};

const payloadChefPetitsFlambeaux = {
  group: "MARNE ET MORIN",
  fonction: [
    { value: "102", label: "--- Chef PF" },
    { value: "301", label: "--- Membre Équipe Régionale" },
  ],
  progression: progressionReelle,
};

describe("normalizeWpLabel", () => {
  it("retire le HTML, le prefixe --- et les accents", () => {
    expect(normalizeWpLabel("<b>Étape 1</b>")).toBe("etape 1");
    expect(normalizeWpLabel("--- Chef Flbx")).toBe("chef flbx");
    expect(normalizeWpLabel("--- Membre Équipe Régionale")).toBe(
      "membre equipe regionale",
    );
  });
});

describe("detectBranche", () => {
  it("lit Chef Flbx dans les fonctions", () => {
    expect(detectBranche(payloadChefFlambeaux.fonction)).toBe("F");
  });

  it("lit Chef PF dans les fonctions", () => {
    expect(detectBranche(payloadChefPetitsFlambeaux.fonction)).toBe("PF");
  });

  it("retombe sur le libelle quand le code est inconnu", () => {
    expect(detectBranche([{ value: "999", label: "--- Chef PF" }])).toBe("PF");
    expect(detectBranche([{ value: "999", label: "--- Chef Flbx" }])).toBe("F");
    expect(
      detectBranche([{ value: "999", label: "--- Chef Petits Flambeaux" }]),
    ).toBe("PF");
  });

  it("ne confond pas Petits Flambeaux avec Flambeaux", () => {
    expect(
      detectBranche([
        { value: "999", label: "--- Cheftaine Petits Flambeaux" },
      ]),
    ).toBe("PF");
  });

  it("ignore les fonctions sans branche", () => {
    expect(
      detectBranche([{ value: "301", label: "--- Membre Équipe Régionale" }]),
    ).toBe(null);
    expect(detectBranche([])).toBe(null);
    expect(detectBranche(undefined)).toBe(null);
  });

  it("retient la premiere fonction listee si le chef en cumule deux", () => {
    expect(
      detectBranche([
        { value: "102", label: "--- Chef PF" },
        { value: "103", label: "--- Chef Flbx" },
      ]),
    ).toBe("PF");
  });
});

describe("parseWpProfile", () => {
  it("extrait le groupe, la branche et les fonctions", () => {
    const profile = parseWpProfile(payloadChefFlambeaux);

    expect(profile.group).toBe("MARNE ET MORIN");
    expect(profile.branche).toBe("F");
    expect(profile.fonctions).toContain("chef flbx");
    expect(profile.progression).toContain("branche flambeaux");
  });

  it("donne PF pour un Chef PF malgre Branche Flambeaux en progression", () => {
    expect(parseWpProfile(payloadChefPetitsFlambeaux).branche).toBe("PF");
  });

  it("renvoie une branche nulle sans fonction", () => {
    expect(parseWpProfile({ progression: progressionReelle }).branche).toBe(
      null,
    );
  });
});

describe("getWpProfile", () => {
  it("renvoie null pour un utilisateur sans donnees wordpress", () => {
    expect(getWpProfile({ id: "1", name: "X" })).toBe(null);
    expect(getWpProfile(null)).toBe(null);
  });
});

describe("getEpauletteVisibility", () => {
  it("sanitise les noms comme le GLTFLoader", () => {
    expect(toSceneNodeName("Epaulette branche F droite")).toBe(
      "Epaulette_branche_F_droite",
    );
  });

  it("affiche F et masque PF pour un Chef Flbx", () => {
    const visibility = getEpauletteVisibility(
      parseWpProfile(payloadChefFlambeaux).branche,
    );

    expect(visibility.get("Epaulette_branche_F_droite")).toBe(true);
    expect(visibility.get("Epaulette_branche_F_gauche")).toBe(true);
    expect(visibility.get("Epaulette_branche_PF_droite")).toBe(false);
    expect(visibility.get("Epaulette_branche_PF_gauche")).toBe(false);
  });

  it("affiche PF et masque F pour un Chef PF", () => {
    const visibility = getEpauletteVisibility(
      parseWpProfile(payloadChefPetitsFlambeaux).branche,
    );

    expect(visibility.get("Epaulette_branche_PF_droite")).toBe(true);
    expect(visibility.get("Epaulette_branche_PF_gauche")).toBe(true);
    expect(visibility.get("Epaulette_branche_F_droite")).toBe(false);
    expect(visibility.get("Epaulette_branche_F_gauche")).toBe(false);
  });

  it("masque toutes les epaulettes si la branche est inconnue", () => {
    const visibility = getEpauletteVisibility(null);

    expect([...visibility.values()].every((v) => v === false)).toBe(true);
    expect(visibility.size).toBe(4);
  });
});

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
