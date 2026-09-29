import { describe, it, expect } from "vitest";

import { formaterAnciennete } from "@/lib/dates";

const maintenant = new Date("2026-09-29T12:00:00Z");
const ilYA = (heures: number) =>
  new Date(maintenant.getTime() - heures * 60 * 60 * 1000);

describe("formaterAnciennete", () => {
  it("regroupe la première heure", () => {
    expect(formaterAnciennete(ilYA(0.5), maintenant)).toBe(
      "il y a moins d'une heure",
    );
  });

  it("compte en heures pendant la première journée", () => {
    expect(formaterAnciennete(ilYA(5), maintenant)).toBe("il y a 5 heures");
  });

  it("compte en jours entamés au-delà de 24 heures", () => {
    expect(formaterAnciennete(ilYA(24), maintenant)).toBe("il y a 1 jour");
    expect(formaterAnciennete(ilYA(80), maintenant)).toBe("il y a 3 jours");
  });
});
