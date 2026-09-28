import { describe, it, expect } from "vitest";

import {
  REGLES_ICONE_ETAPE,
  REGLES_JUSTIFICATION,
  toAttributAccept,
  toMegaOctets,
  validerFichier,
} from "@/lib/fichiers";

const UN_MO = 1024 * 1024;

describe("validerFichier", () => {
  it("accepte un PDF de justification sous la limite", () => {
    expect(
      validerFichier(
        { type: "application/pdf", size: 2 * UN_MO },
        REGLES_JUSTIFICATION,
      ),
    ).toBeNull();
  });

  it("refuse un type absent des règles en citant les types acceptés", () => {
    expect(
      validerFichier({ type: "image/svg+xml", size: 10 }, REGLES_ICONE_ETAPE),
    ).toBe("Type de fichier non autorisé (PNG uniquement)");
  });

  it("refuse un fichier au-delà de la taille maximum", () => {
    expect(
      validerFichier(
        { type: "image/png", size: UN_MO + 1 },
        REGLES_ICONE_ETAPE,
      ),
    ).toBe("Fichier trop volumineux (1 Mo maximum)");
  });

  it("accepte un fichier exactement à la taille maximum", () => {
    expect(
      validerFichier({ type: "image/png", size: UN_MO }, REGLES_ICONE_ETAPE),
    ).toBeNull();
  });
});

describe("toAttributAccept", () => {
  it("liste les types MIME séparés par des virgules", () => {
    expect(toAttributAccept(REGLES_ICONE_ETAPE)).toBe("image/png");
  });
});

describe("toMegaOctets", () => {
  it("arrondit au dixième de Mo", () => {
    expect(toMegaOctets(1.25 * UN_MO)).toBe(1.3);
  });
});
