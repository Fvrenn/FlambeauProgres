import type { ValidationEvent } from "@/lib/analytics";

import { describe, it, expect } from "vitest";

import {
  agregerParEtape,
  agregerParReferent,
  calculerKpis,
  debutPeriode,
  parsePeriode,
} from "@/lib/analytics";

function evenement(surcharge: Partial<ValidationEvent> = {}): ValidationEvent {
  return {
    id: "e1",
    type: "REALISATION",
    date: new Date("2026-07-01T10:00:00Z"),
    referentId: "ref1",
    referentName: "Martin",
    referentRole: "REFERENT",
    chefId: "c1",
    chefName: "Chef A",
    etapeId: "et1",
    etapeName: "Cuisine",
    objet: "3.2 - Cuisiner",
    justificationId: "j1",
    ...surcharge,
  };
}

describe("parsePeriode / debutPeriode", () => {
  it("retombe sur « tout » pour une valeur inconnue", () => {
    expect(parsePeriode(undefined)).toBe("tout");
    expect(parsePeriode("nimporte")).toBe("tout");
    expect(parsePeriode("30j")).toBe("30j");
  });

  it("ne borne pas la période « tout »", () => {
    expect(debutPeriode("tout", new Date("2026-08-01T00:00:00Z"))).toBeNull();
  });

  it("recule du bon nombre de jours", () => {
    const debut = debutPeriode("30j", new Date("2026-08-01T00:00:00Z"));

    expect(debut?.toISOString()).toBe("2026-07-02T00:00:00.000Z");
  });
});

describe("agregerParReferent", () => {
  it("compte les validations par référent, trié par volume", () => {
    const stats = agregerParReferent([
      evenement({ id: "a" }),
      evenement({ id: "b", type: "BADGE" }),
      evenement({ id: "c", referentId: "ref2", referentName: "Claire" }),
    ]);

    expect(stats).toEqual([
      { id: "ref1", label: "Martin", total: 2 },
      { id: "ref2", label: "Claire", total: 1 },
    ]);
  });

  it("départage les ex aequo par ordre alphabétique", () => {
    const stats = agregerParReferent([
      evenement({ id: "a", referentId: "ref2", referentName: "Zoé" }),
      evenement({ id: "b", referentId: "ref1", referentName: "Alice" }),
    ]);

    expect(stats.map((stat) => stat.label)).toEqual(["Alice", "Zoé"]);
  });

  it("renvoie une liste vide sans évènement", () => {
    expect(agregerParReferent([])).toEqual([]);
  });
});

describe("agregerParEtape", () => {
  it("compte les validations par étape, trié par volume", () => {
    const stats = agregerParEtape([
      evenement({ id: "a" }),
      evenement({ id: "b", etapeId: "et2", etapeName: "Nature" }),
      evenement({ id: "c", etapeId: "et2", etapeName: "Nature" }),
    ]);

    expect(stats).toEqual([
      { id: "et2", label: "Nature", total: 2 },
      { id: "et1", label: "Cuisine", total: 1 },
    ]);
  });
});

describe("calculerKpis", () => {
  it("résume la période sans doublonner chefs, étapes ni référents", () => {
    const kpis = calculerKpis([
      evenement({ id: "a" }),
      evenement({ id: "b", chefId: "c2", chefName: "Chef B" }),
      evenement({
        id: "c",
        type: "BADGE",
        referentId: "ref2",
        referentName: "Claire",
        etapeId: "et2",
        etapeName: "Nature",
      }),
    ]);

    expect(kpis).toEqual({
      total: 3,
      realisations: 2,
      badges: 1,
      referentsActifs: 2,
      chefsConcernes: 2,
      etapesConcernees: 2,
    });
  });

  it("renvoie des compteurs à zéro sans donnée", () => {
    expect(calculerKpis([])).toEqual({
      total: 0,
      realisations: 0,
      badges: 0,
      referentsActifs: 0,
      chefsConcernes: 0,
      etapesConcernees: 0,
    });
  });
});
