import { describe, it, expect } from "vitest";

import { chefsAyantToutValide } from "@/lib/justification";

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
