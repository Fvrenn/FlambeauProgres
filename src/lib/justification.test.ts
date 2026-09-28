import { describe, it, expect } from "vitest";

import {
  chefsAyantToutValide,
  filtreJustificationsValidantes,
  statutValidant,
} from "@/lib/justification";

const total = { competences: 2, realisations: 1 };

describe("chefsAyantToutValide", () => {
  it("retient le chef qui a validé toutes les compétences et réalisations", () => {
    expect(
      chefsAyantToutValide(
        [
          { chefId: "c1", type: "COMPETENCE" },
          { chefId: "c1", type: "COMPETENCE" },
          { chefId: "c1", type: "REALISATION" },
        ],
        total,
      ),
    ).toEqual(["c1"]);
  });

  it("écarte un chef à qui il manque une réalisation", () => {
    expect(
      chefsAyantToutValide(
        [
          { chefId: "c2", type: "COMPETENCE" },
          { chefId: "c2", type: "COMPETENCE" },
        ],
        total,
      ),
    ).toEqual([]);
  });

  it("compte chaque chef séparément", () => {
    expect(
      chefsAyantToutValide(
        [
          { chefId: "c1", type: "REALISATION" },
          { chefId: "c2", type: "REALISATION" },
        ],
        { competences: 0, realisations: 1 },
      ),
    ).toEqual(["c1", "c2"]);
  });
});

describe("statutValidant", () => {
  it("compte une compétence d'étape 2 dès que le chef l'a remplie", () => {
    expect(statutValidant("COMPETENCE", 2)).toBe("AUTO_VALIDEE");
  });

  it("exige l'évaluation de la commission pour une compétence d'étape 3", () => {
    expect(statutValidant("COMPETENCE", 3)).toBe("VALIDEE");
  });

  it("exige toujours l'évaluation d'une réalisation", () => {
    expect(statutValidant("REALISATION", 2)).toBe("VALIDEE");
    expect(statutValidant("REALISATION", 3)).toBe("VALIDEE");
  });
});

describe("filtreJustificationsValidantes", () => {
  it("n'accepte que des compétences évaluées sur l'étape 3", () => {
    expect(filtreJustificationsValidantes(3).OR[0]).toEqual({
      statut: "VALIDEE",
      objectif: { type: "COMPETENCE" },
    });
  });
});
