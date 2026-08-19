import { describe, expect, it } from "vitest";

import {
  detectBranche,
  getWpProfile,
  normalizeWpLabel,
  parseWpProfile,
} from "./wordpress-profile";

import { getEpauletteVisibility, toSceneNodeName } from "@/lib/chemise-parts";

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
