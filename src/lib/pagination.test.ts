import { describe, it, expect } from "vitest";

import { decouperEnPages } from "@/lib/pagination";

describe("decouperEnPages", () => {
  it("remplit les pages dans l'ordre et laisse le reste sur la dernière", () => {
    expect(decouperEnPages([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("tient sur une seule page quand il y a moins d'éléments que la taille", () => {
    expect(decouperEnPages([1, 2], 12)).toEqual([[1, 2]]);
  });

  it("ne crée aucune page sans élément", () => {
    expect(decouperEnPages([], 12)).toEqual([]);
  });
});
