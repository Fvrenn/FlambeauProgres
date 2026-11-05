import { describe, it, expect } from "vitest";

import {
  comparerGroupes,
  joursDepuis,
  lignesEnAttente,
  parGroupe,
  SANS_GROUPE,
  syntheseParEtape,
  versCsvARemettre,
} from "@/lib/suivi";

describe("joursDepuis", () => {
  it("compte les jours entiers écoulés", () => {
    expect(
      joursDepuis(
        new Date("2026-11-01T10:00:00Z"),
        new Date("2026-11-05T09:00:00Z"),
      ),
    ).toBe(3);
  });

  it("ne renvoie jamais de durée négative", () => {
    expect(
      joursDepuis(
        new Date("2026-11-06T10:00:00Z"),
        new Date("2026-11-05T09:00:00Z"),
      ),
    ).toBe(0);
  });
});

describe("syntheseParEtape", () => {
  const etapes = [
    { id: "e1", name: "Cuisine", niveau: 2 },
    { id: "e2", name: "Nature", niveau: 2 },
    { id: "e3", name: "Formateur", niveau: 3 },
  ];

  it("compte chaque élément en attente sur son étape", () => {
    expect(
      syntheseParEtape(etapes, {
        aEvaluer: [{ etape: { id: "e1" } }, { etape: { id: "e1" } }],
        enAttenteDuChef: [{ etape: { id: "e3" } }],
        aValider: [{ etapeId: "e1" }],
      }),
    ).toEqual([
      { ...etapes[0], aEvaluer: 2, enAttenteDuChef: 0, aValider: 1 },
      { ...etapes[2], aEvaluer: 0, enAttenteDuChef: 1, aValider: 0 },
    ]);
  });

  it("n'affiche pas les étapes sans rien en attente", () => {
    expect(
      syntheseParEtape(etapes, {
        aEvaluer: [],
        enAttenteDuChef: [],
        aValider: [],
      }),
    ).toEqual([]);
  });
});

describe("parGroupe", () => {
  const badge = (nom: string, groupe: string | null) => ({
    nom,
    chef: { groupe },
  });

  it("trie les groupes et place les chefs sans groupe à la fin", () => {
    const groupes = parGroupe([
      badge("a", "COLMAR"),
      badge("b", null),
      badge("c", "BARR"),
      badge("d", "COLMAR"),
      badge("e", "  "),
    ]);

    expect(groupes.map(([groupe]) => groupe)).toEqual([
      "BARR",
      "COLMAR",
      SANS_GROUPE,
    ]);
    expect(groupes[1][1].map(({ nom }) => nom)).toEqual(["a", "d"]);
    expect(groupes[2][1].map(({ nom }) => nom)).toEqual(["b", "e"]);
  });
});

describe("versCsvARemettre", () => {
  it("liste les badges groupe par groupe, prêts pour un tableur", () => {
    const csv = versCsvARemettre([
      {
        id: "s1",
        valideeAt: new Date("2026-10-12T08:00:00Z"),
        chef: { name: "Jean", email: "jean@x.fr", groupe: "COLMAR" },
        etape: { name: "Cuisine" },
        valideePar: { name: "Martin" },
      },
      {
        id: "s2",
        valideeAt: null,
        chef: { name: "=Paul", email: "paul@x.fr", groupe: null },
        etape: { name: "Nature" },
        valideePar: null,
      },
    ]).split("\r\n");

    expect(csv[0]).toBe(
      '"Groupe";"Chef";"Email";"Badge";"Valide le";"Valide par"',
    );
    expect(csv[1]).toBe(
      '"COLMAR";"Jean";"jean@x.fr";"Cuisine";"2026-10-12";"Martin"',
    );
    expect(csv[2]).toBe(`"${SANS_GROUPE}";"'=Paul";"paul@x.fr";"Nature";"";""`);
  });
});

describe("lignesEnAttente", () => {
  const chef = {
    id: "c1",
    name: "Jean",
    email: "jean@x.fr",
    image: null,
    groupe: "COLMAR",
  };
  const cuisine = { id: "e2", name: "Cuisine", niveau: 2 };
  const formateur = { id: "e3", name: "Formateur", niveau: 3 };
  const justification = (id: string, etape: typeof cuisine) => ({
    id,
    soumiseAt: new Date("2026-11-01T10:00:00Z"),
    updatedAt: new Date("2026-11-03T10:00:00Z"),
    chef,
    etape,
    objectif: { code: "C1", description: "Cuisiner" },
  });
  const enAttente = {
    etapes: [cuisine, formateur],
    aEvaluer: [justification("j1", cuisine)],
    enAttenteDuChef: [justification("j2", formateur)],
    aValider: [{ chef, etapeId: "e3" }],
  };

  it("réunit les trois listes avec leur ancienneté", () => {
    const lignes = lignesEnAttente(enAttente, "referent");

    expect(
      lignes.map(({ type, objet, depuis }) => [type, objet, depuis]),
    ).toEqual([
      ["a-evaluer", "C1 - Cuisiner", new Date("2026-11-01T10:00:00Z")],
      ["attente-chef", "C1 - Cuisiner", new Date("2026-11-03T10:00:00Z")],
      ["a-valider", "Dossier complet", null],
    ]);
  });

  it("donne au référent un lien vers chaque élément de ses étapes", () => {
    expect(lignesEnAttente(enAttente, "referent")[0].lien).toBe(
      "/referent/dashboard?etapeId=e2&justification=j1",
    );
  });

  it("n'ouvre à l'encadrement que l'Étape 3, qui se traite dans son espace", () => {
    const lignes = lignesEnAttente(enAttente, "coordination");

    expect(lignes.map(({ lien }) => lien)).toEqual([
      null,
      "/coordination/validations?justification=j2",
      "/coordination/dossier?chefId=c1&etapeId=e3",
    ]);
  });
});

describe("comparerGroupes", () => {
  it("trie par ordre alphabétique et garde « Sans groupe » en dernier", () => {
    expect(["COLMAR", SANS_GROUPE, "BARR"].sort(comparerGroupes)).toEqual([
      "BARR",
      "COLMAR",
      SANS_GROUPE,
    ]);
  });
});
