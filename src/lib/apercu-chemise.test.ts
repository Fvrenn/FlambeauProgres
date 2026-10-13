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

  it("montre les barrettes des étapes validées", () => {
    expect(
      cheminApercuChemise("ordinateur", "F", {
        etape1Validee: true,
        etape2Validee: false,
      }),
    ).toBe("/chemise/apercu-ordinateur-f-etape1.webp");
    expect(
      cheminApercuChemise("telephone", null, {
        etape1Validee: true,
        etape2Validee: true,
      }),
    ).toBe("/chemise/apercu-telephone-sans-branche-etape2.webp");
  });
});
