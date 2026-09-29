import { describe, it, expect } from "vitest";

import { cheminApercuChemise } from "@/lib/apercu-chemise";

describe("cheminApercuChemise", () => {
  it("nomme l'aperçu d'après le format et la branche", () => {
    expect(cheminApercuChemise("telephone", "PF")).toBe(
      "/chemise/apercu-telephone-pf.webp",
    );
  });

  it("a un aperçu pour les chefs sans branche", () => {
    expect(cheminApercuChemise("ordinateur", null)).toBe(
      "/chemise/apercu-ordinateur-sans-branche.webp",
    );
  });
});
