import type { ContexteParcours } from "@/lib/parcours";

import { describe, it, expect } from "vitest";

import {
  niveauMaxDebloque,
  etapeEstDebloquee,
  jalonsImplicites,
  auMoinsUneSpecialiteValidee,
  construireContexteParcours,
  etapeEstAccessible,
  jalonProfilsEstValide,
  estJalonBloquant,
  NIVEAU_PROFILS,
} from "@/lib/parcours";

const jalons = [
  { id: "af", niveau: 0 },
  { id: "e1", niveau: 1 },
];

describe("niveauMaxDebloque", () => {
  it("ne débloque que le niveau 0 pour un chef sans validation", () => {
    expect(niveauMaxDebloque(jalons, new Set())).toBe(0);
  });

  it("débloque jusqu'au niveau 1 quand l'Allume-feu est validé", () => {
    expect(niveauMaxDebloque(jalons, new Set(["af"]))).toBe(1);
  });

  it("débloque tous les niveaux quand tous les jalons sont validés", () => {
    expect(niveauMaxDebloque(jalons, new Set(["af", "e1"]))).toBe(
      Number.POSITIVE_INFINITY,
    );
  });

  it("reste borné par le jalon non validé le plus bas", () => {
    expect(niveauMaxDebloque(jalons, new Set(["e1"]))).toBe(0);
  });

  it("ignore les validations qui ne correspondent à aucun jalon", () => {
    expect(niveauMaxDebloque(jalons, new Set(["badge-x"]))).toBe(0);
  });

  it("débloque tout en l'absence de jalon", () => {
    expect(niveauMaxDebloque([], new Set())).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("etapeEstDebloquee", () => {
  it("débloque une étape sous le plafond", () => {
    expect(etapeEstDebloquee(0, 1)).toBe(true);
  });

  it("débloque une étape pile au plafond", () => {
    expect(etapeEstDebloquee(1, 1)).toBe(true);
  });

  it("verrouille une étape au-dessus du plafond", () => {
    expect(etapeEstDebloquee(2, 1)).toBe(false);
  });

  it("débloque tout quand le plafond est infini", () => {
    expect(etapeEstDebloquee(3, Number.POSITIVE_INFINITY)).toBe(true);
  });
});

describe("jalonsImplicites", () => {
  it("deduit Allume-feu quand la plateforme declare l'Etape 1", () => {
    expect(jalonsImplicites([{ id: "e1", niveau: 1 }], jalons)).toEqual(["af"]);
  });

  it("deduit les deux jalons quand un badge de niveau 2 est declare", () => {
    expect(jalonsImplicites([{ id: "2h", niveau: 2 }], jalons)).toEqual([
      "af",
      "e1",
    ]);
  });

  it("ne deduit rien quand seul le niveau 0 est declare", () => {
    expect(jalonsImplicites([{ id: "af", niveau: 0 }], jalons)).toEqual([]);
  });

  it("ne redeclare pas un jalon deja present", () => {
    expect(
      jalonsImplicites(
        [
          { id: "af", niveau: 0 },
          { id: "e1", niveau: 1 },
        ],
        jalons,
      ),
    ).toEqual([]);
  });

  it("ne deduit rien sans etape declaree", () => {
    expect(jalonsImplicites([], jalons)).toEqual([]);
  });
});

const catalogue = [
  { id: "af", niveau: 0, type: "JALON" },
  { id: "e1", niveau: 1, type: "JALON" },
  { id: "2h", niveau: 2, type: "BADGE" },
  { id: "3c", niveau: 3, type: "BADGE" },
];

const profil = { id: "3c", niveau: 3, type: "BADGE" };

describe("auMoinsUneSpecialiteValidee", () => {
  it("detecte une specialite de niveau 2 validee", () => {
    expect(auMoinsUneSpecialiteValidee(catalogue, new Set(["2h"]))).toBe(true);
  });

  it("ignore les jalons et les profils", () => {
    expect(
      auMoinsUneSpecialiteValidee(catalogue, new Set(["af", "e1", "3c"])),
    ).toBe(false);
  });
});

describe("jalonProfilsEstValide", () => {
  const avecJalon = [
    { id: "3", niveau: 3, type: "JALON" },
    { id: "3c", niveau: 3, type: "BADGE" },
  ];

  it("est vrai quand aucun jalon de niveau 3 n'existe", () => {
    expect(jalonProfilsEstValide(catalogue, new Set())).toBe(true);
  });

  it("est faux tant que le livret Servir n'est pas validé", () => {
    expect(jalonProfilsEstValide(avecJalon, new Set())).toBe(false);
  });

  it("est vrai une fois le livret Servir validé", () => {
    expect(jalonProfilsEstValide(avecJalon, new Set(["3"]))).toBe(true);
  });
});

describe("etapeEstAccessible", () => {
  const contexte = (surcharge: Partial<ContexteParcours> = {}) => ({
    niveauMax: Number.POSITIVE_INFINITY,
    specialiteValidee: true,
    jalonProfilsValide: true,
    etapesValidees: new Set<string>(),
    ...surcharge,
  });

  it("verrouille un profil sans specialite validee", () => {
    expect(
      etapeEstAccessible(profil, contexte({ specialiteValidee: false })),
    ).toBe(false);
  });

  it("ouvre un profil des qu'une specialite est validee", () => {
    expect(etapeEstAccessible(profil, contexte())).toBe(true);
  });

  it("n'ouvre pas un profil si le niveau reste bloque par un jalon", () => {
    expect(etapeEstAccessible(profil, contexte({ niveauMax: 1 }))).toBe(false);
  });

  it("laisse toujours visible un profil deja valide", () => {
    expect(
      etapeEstAccessible(
        profil,
        contexte({
          niveauMax: 0,
          specialiteValidee: false,
          etapesValidees: new Set(["3c"]),
        }),
      ),
    ).toBe(true);
  });

  it("n'impose pas de specialite aux etapes de niveau inferieur", () => {
    expect(
      etapeEstAccessible(
        { id: "2h", niveau: 2, type: "BADGE" },
        contexte({ specialiteValidee: false }),
      ),
    ).toBe(true);
  });

  it("verrouille un profil tant que le livret Servir n'est pas lu", () => {
    expect(
      etapeEstAccessible(profil, contexte({ jalonProfilsValide: false })),
    ).toBe(false);
  });

  it("laisse le jalon Servir accessible avant sa propre validation", () => {
    expect(
      etapeEstAccessible(
        { id: "3", niveau: 3, type: "JALON" },
        contexte({ jalonProfilsValide: false }),
      ),
    ).toBe(true);
  });

  it("verrouille le jalon Servir sans specialite validee", () => {
    expect(
      etapeEstAccessible(
        { id: "3", niveau: 3, type: "JALON" },
        contexte({ specialiteValidee: false, jalonProfilsValide: false }),
      ),
    ).toBe(false);
  });
});

describe("construireContexteParcours", () => {
  const parcours = [
    { id: "af", niveau: 0, type: "JALON" },
    { id: "e1", niveau: 1, type: "JALON" },
    { id: "b2", niveau: 2, type: "BADGE" },
    { id: "servir", niveau: 3, type: "JALON" },
  ];

  it("s'arrête au premier jalon non validé", () => {
    const contexte = construireContexteParcours(parcours, new Set(["af"]));

    expect(contexte.niveauMax).toBe(1);
    expect(contexte.specialiteValidee).toBe(false);
    expect(contexte.jalonProfilsValide).toBe(false);
  });

  it("repère la spécialité et le jalon Servir validés", () => {
    const contexte = construireContexteParcours(
      parcours,
      new Set(["af", "e1", "b2", "servir"]),
    );

    expect(contexte.niveauMax).toBe(Number.POSITIVE_INFINITY);
    expect(contexte.specialiteValidee).toBe(true);
    expect(contexte.jalonProfilsValide).toBe(true);
  });
});

describe("estJalonBloquant", () => {
  const jalon = (niveau: number, isValidated = false, verrouille = false) => ({
    type: "JALON",
    niveau,
    isValidated,
    verrouille,
  });

  it("bloque sur Allume-feu ou Découvrir non validé et débloqué", () => {
    expect(estJalonBloquant(jalon(0))).toBe(true);
    expect(estJalonBloquant(jalon(1))).toBe(true);
  });

  it("ne bloque pas sur Servir, même accessible et non validé", () => {
    expect(estJalonBloquant(jalon(NIVEAU_PROFILS))).toBe(false);
  });

  it("ne bloque pas sur un jalon validé, verrouillé ou un badge", () => {
    expect(estJalonBloquant(jalon(1, true))).toBe(false);
    expect(estJalonBloquant(jalon(1, false, true))).toBe(false);
    expect(estJalonBloquant({ ...jalon(1), type: "BADGE" })).toBe(false);
  });
});
