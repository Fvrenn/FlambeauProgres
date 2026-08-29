import { describe, expect, it } from "vitest";

import { parseWpProfile } from "./wordpress-profile";
import {
  resoudreProgressionWp,
  valeursWpPourEtapes,
} from "./wordpress-progression";

const progressionPlateforme = [
  { value: "1", label: "<b>Étape 1</b>" },
  { value: "101", label: "--- Étape 1" },
  { value: "2", label: "<b>Étape 2</b>" },
  { value: "203", label: "--- Branche Flambeaux" },
  { value: "206", label: "--- Communication" },
  { value: "208", label: "--- Cuisine" },
];

const etapes = [
  { id: "e-decouvrir", name: "Découvrir", wpValue: "101" },
  { id: "e-2c", name: "Branche Flambeaux", wpValue: "203" },
  { id: "e-2f", name: "Communication", wpValue: "206" },
  { id: "e-2h", name: "Cuisine", wpValue: "208" },
  { id: "e-2l", name: "Nature", wpValue: "212" },
  { id: "e-allume-feu", name: "Allume-feu", wpValue: null },
];

const taxonomieComplete = [
  { value: "1", label: "<b>Étape 1</b>" },
  { value: "101", label: "--- Étape 1" },
  { value: "2", label: "<b>Étape 2</b>" },
  { value: "201", label: "--- Branche Lumignons" },
  { value: "202", label: "--- Branche Petits Flambeaux" },
  { value: "203", label: "--- Branche Flambeaux" },
  { value: "204", label: "--- Branche Pionniers" },
  { value: "205", label: "--- Animation" },
  { value: "206", label: "--- Communication" },
  { value: "207", label: "--- Construction" },
  { value: "208", label: "--- Cuisine" },
  { value: "209", label: "--- Exploration" },
  { value: "210", label: "--- Intendance" },
  { value: "211", label: "--- Matériel" },
  { value: "212", label: "--- Nature" },
  { value: "213", label: "--- Santé" },
  { value: "214", label: "--- Vie Spi" },
  { value: "215", label: "--- Ma spé" },
  { value: "3", label: "<b>Étape 3</b>" },
  { value: "301", label: "--- Expert" },
  { value: "302", label: "--- Formateur" },
  { value: "303", label: "--- Leader" },
];

const etapesApp = [
  { id: "e-0", name: "Allume-feu", wpValue: null },
  { id: "e-1", name: "Découvrir", wpValue: "101" },
  { id: "e-2b", name: "Branche Petits Flambeaux", wpValue: "202" },
  { id: "e-2c", name: "Branche Flambeaux", wpValue: "203" },
  { id: "e-2e", name: "Animation", wpValue: "205" },
  { id: "e-2f", name: "Communication", wpValue: "206" },
  { id: "e-2g", name: "Construction", wpValue: "207" },
  { id: "e-2h", name: "Cuisine", wpValue: "208" },
  { id: "e-2i", name: "Exploration", wpValue: "209" },
  { id: "e-2j", name: "Intendance", wpValue: "210" },
  { id: "e-2k", name: "Matériel", wpValue: "211" },
  { id: "e-2l", name: "Nature", wpValue: "212" },
  { id: "e-2m", name: "Santé", wpValue: "213" },
  { id: "e-2n", name: "Vie Spirituelle", wpValue: "214" },
];

describe("taxonomie complete de la plateforme", () => {
  const { etapeIds, nonReconnues } = resoudreProgressionWp(
    parseWpProfile({ progression: taxonomieComplete }).progressionEntries,
    etapesApp,
  );

  it("associe toutes les etapes presentes dans l'app", () => {
    expect(etapeIds).toEqual([
      "e-1",
      "e-2b",
      "e-2c",
      "e-2e",
      "e-2f",
      "e-2g",
      "e-2h",
      "e-2i",
      "e-2j",
      "e-2k",
      "e-2l",
      "e-2m",
      "e-2n",
    ]);
  });

  it("rattache Vie Spi a Vie Spirituelle via l'identifiant plateforme", () => {
    expect(etapeIds).toContain("e-2n");
  });

  it("laisse de cote les entrees absentes de l'app", () => {
    expect(nonReconnues.map((entry) => entry.value)).toEqual([
      "201",
      "204",
      "215",
      "301",
      "302",
      "303",
    ]);
  });
});

describe("parseWpProfile.progressionEntries", () => {
  it("ignore les en-tetes de categorie en gras", () => {
    const profile = parseWpProfile({ progression: progressionPlateforme });

    expect(profile.progressionEntries.map((entry) => entry.value)).toEqual([
      "101",
      "203",
      "206",
      "208",
    ]);
  });
});

describe("resoudreProgressionWp", () => {
  it("associe les entrees de la plateforme aux etapes", () => {
    const { etapeIds, nonReconnues } = resoudreProgressionWp(
      parseWpProfile({ progression: progressionPlateforme }).progressionEntries,
      etapes,
    );

    expect(etapeIds).toEqual(["e-decouvrir", "e-2c", "e-2f", "e-2h"]);
    expect(nonReconnues).toHaveLength(0);
  });

  it("retombe sur le libelle quand la valeur est inconnue", () => {
    const { etapeIds } = resoudreProgressionWp(
      [{ value: "999", label: "--- Nature" }],
      etapes,
    );

    expect(etapeIds).toEqual(["e-2l"]);
  });

  it("remonte les entrees sans correspondance", () => {
    const { etapeIds, nonReconnues } = resoudreProgressionWp(
      [{ value: "777", label: "--- Spécialité inconnue" }],
      etapes,
    );

    expect(etapeIds).toHaveLength(0);
    expect(nonReconnues).toHaveLength(1);
  });

  it("ne duplique pas une etape citee deux fois", () => {
    const { etapeIds } = resoudreProgressionWp(
      [
        { value: "206", label: "--- Communication" },
        { value: "206", label: "--- Communication" },
      ],
      etapes,
    );

    expect(etapeIds).toEqual(["e-2f"]);
  });
});

describe("valeursWpPourEtapes", () => {
  it("convertit les etapes en valeurs de la plateforme", () => {
    const { valeurs, sansCorrespondance } = valeursWpPourEtapes(
      ["e-2c", "e-2h"],
      etapes,
    );

    expect(valeurs).toEqual(["203", "208"]);
    expect(sansCorrespondance).toHaveLength(0);
  });

  it("signale les etapes sans identifiant plateforme", () => {
    const { valeurs, sansCorrespondance } = valeursWpPourEtapes(
      ["e-allume-feu"],
      etapes,
    );

    expect(valeurs).toHaveLength(0);
    expect(sansCorrespondance).toEqual(["e-allume-feu"]);
  });
});
