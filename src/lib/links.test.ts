import { describe, it, expect, vi, beforeEach } from "vitest";

import { dossierAValiderUrl, evaluateurThreadUrl } from "@/lib/links";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("APP_URL", "https://progres.flambeaux.org");
});

describe("evaluateurThreadUrl", () => {
  it("envoie le référent sur son dashboard pour les étapes 1 et 2", () => {
    expect(evaluateurThreadUrl({ id: "e2", niveau: 2 }, "j1")).toBe(
      "https://progres.flambeaux.org/referent/dashboard?etapeId=e2&justification=j1",
    );
  });

  it("envoie la commission dans son espace pour l'Étape 3", () => {
    expect(evaluateurThreadUrl({ id: "e3", niveau: 3 }, "j1")).toBe(
      "https://progres.flambeaux.org/commission/evaluations?justification=j1",
    );
  });
});

describe("dossierAValiderUrl", () => {
  it("ouvre le dossier dans l'espace Coordination", () => {
    expect(dossierAValiderUrl("c1", "e3")).toBe(
      "https://progres.flambeaux.org/coordination/dossier?chefId=c1&etapeId=e3",
    );
  });
});
