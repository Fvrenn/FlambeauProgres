import { describe, expect, it } from "vitest";

import {
  SANS_GROUPE,
  agregerValidationsParGroupe,
  classerGroupes,
  cleGroupe,
  compterParGroupe,
} from "./groupes";

describe("compterParGroupe", () => {
  it("compte les membres par groupe, du plus grand au plus petit, sans groupe en dernier", () => {
    expect(
      compterParGroupe([
        { groupe: "COLMAR" },
        { groupe: null },
        { groupe: "BARR" },
        { groupe: "COLMAR" },
        { groupe: "  " },
      ]),
    ).toEqual([
      { cle: "COLMAR", libelle: "COLMAR", total: 2 },
      { cle: "BARR", libelle: "BARR", total: 1 },
      { cle: SANS_GROUPE, libelle: "Sans groupe", total: 2 },
    ]);
  });

  it("départage les égalités par ordre alphabétique", () => {
    expect(
      compterParGroupe([{ groupe: "MULHOUSE" }, { groupe: "BARR" }]).map(
        (effectif) => effectif.cle,
      ),
    ).toEqual(["BARR", "MULHOUSE"]);
  });
});

describe("cleGroupe", () => {
  it("regroupe les valeurs vides sous la même clé", () => {
    expect(cleGroupe(null)).toBe(SANS_GROUPE);
    expect(cleGroupe("")).toBe(SANS_GROUPE);
    expect(cleGroupe(" COLMAR ")).toBe("COLMAR");
  });
});

describe("agregerValidationsParGroupe / classerGroupes", () => {
  const groupes = agregerValidationsParGroupe(
    [
      { groupe: "COLMAR", origine: "APP" },
      { groupe: "COLMAR", origine: "PLATEFORME" },
      { groupe: "BARR", origine: "PLATEFORME" },
      { groupe: "BARR", origine: "PLATEFORME" },
      { groupe: null, origine: "APP" },
    ],
    ["COLMAR", "BARR", "MULHOUSE", null],
  );

  it("garde les groupes sans validation à zéro", () => {
    expect(groupes.find((g) => g.cle === "MULHOUSE")).toEqual({
      cle: "MULHOUSE",
      libelle: "MULHOUSE",
      app: 0,
      plateforme: 0,
    });
  });

  it("classe selon l'origine choisie, sans groupe en dernier", () => {
    expect(
      classerGroupes(groupes, "TOUTES").map((g) => [g.cle, g.total]),
    ).toEqual([
      ["BARR", 2],
      ["COLMAR", 2],
      ["MULHOUSE", 0],
      [SANS_GROUPE, 1],
    ]);
    expect(classerGroupes(groupes, "APP").map((g) => [g.cle, g.total])).toEqual(
      [
        ["COLMAR", 1],
        ["BARR", 0],
        ["MULHOUSE", 0],
        [SANS_GROUPE, 1],
      ],
    );
    expect(
      classerGroupes(groupes, "PLATEFORME").map((g) => [g.cle, g.total]),
    ).toEqual([
      ["BARR", 2],
      ["COLMAR", 1],
      ["MULHOUSE", 0],
      [SANS_GROUPE, 0],
    ]);
  });
});
