import { describe, it, expect } from "vitest";

import {
  lienDiscussion,
  lienDossier,
  lienRetourDossier,
} from "@/lib/espaces-suivi";

describe("lienDiscussion", () => {
  it("garde l'étape dans le dashboard référent", () => {
    expect(lienDiscussion("referent", "e1", "j1")).toBe(
      "/referent/dashboard?etapeId=e1&justification=j1",
    );
  });

  it("reste dans l'espace d'où l'on vient pour l'Étape 3", () => {
    expect(lienDiscussion("commission", "e1", "j1")).toBe(
      "/commission/evaluations?justification=j1",
    );
    expect(lienDiscussion("coordination", "e1", "j1")).toBe(
      "/coordination/validations?justification=j1",
    );
  });
});

describe("lienDossier", () => {
  it("ouvre le dossier du chef dans le bon espace", () => {
    expect(lienDossier("referent", "c1", "e1")).toBe(
      "/referent/revision?chefId=c1&etapeId=e1",
    );
    expect(lienDossier("commission", "c1", "e1")).toBe(
      "/commission/dossier?chefId=c1&etapeId=e1",
    );
    expect(lienDossier("coordination", "c1", "e1")).toBe(
      "/coordination/dossier?chefId=c1&etapeId=e1",
    );
  });
});

describe("lienRetourDossier", () => {
  it("revient sur l'onglet des badges à réviser côté référent", () => {
    expect(lienRetourDossier("referent", "e1")).toBe(
      "/referent/dashboard?etapeId=e1&tab=a-reviser",
    );
  });

  it("revient à l'accueil de l'espace pour l'Étape 3", () => {
    expect(lienRetourDossier("commission", "e1")).toBe(
      "/commission/evaluations",
    );
    expect(lienRetourDossier("coordination", "e1")).toBe(
      "/coordination/validations",
    );
  });
});
