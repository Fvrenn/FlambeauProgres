import { describe, it, expect } from "vitest";

import {
  niveauMaxDebloque,
  etapeEstDebloquee,
  jalonsImplicites,
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
