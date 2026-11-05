import { describe, it, expect } from "vitest";

import {
  accedeEspaceCommission,
  accedeEspaceCoordination,
  estAdmin,
  estReferent,
  peutEvaluerEtape,
  peutValiderEtape,
  consulteEtape3,
  peutGererRemises,
  competenceSoumiseAEvaluation,
  etapeSeGereParAssignation,
} from "@/lib/roles";

describe("estAdmin / estReferent", () => {
  it("donne les droits admin à la commission et au coordinateur", () => {
    expect(estAdmin("ADMIN")).toBe(true);
    expect(estAdmin("COMMISSION_FORMATION")).toBe(true);
    expect(estAdmin("COORDINATEUR_NATIONAL")).toBe(true);
    expect(estAdmin("REFERENT")).toBe(false);
    expect(estAdmin("CHEF")).toBe(false);
    expect(estAdmin(undefined)).toBe(false);
  });

  it("englobe les rôles référent", () => {
    expect(estReferent("REFERENT")).toBe(true);
    expect(estReferent("COMMISSION_FORMATION")).toBe(true);
    expect(estReferent("COORDINATEUR_NATIONAL")).toBe(true);
    expect(estReferent("CHEF")).toBe(false);
  });
});

describe("accedeEspaceCommission / accedeEspaceCoordination", () => {
  it("sépare la commission, qui évalue, du coordinateur, qui valide", () => {
    expect(accedeEspaceCommission("COMMISSION_FORMATION")).toBe(true);
    expect(accedeEspaceCommission("COORDINATEUR_NATIONAL")).toBe(false);
    expect(accedeEspaceCoordination("COORDINATEUR_NATIONAL")).toBe(true);
    expect(accedeEspaceCoordination("COMMISSION_FORMATION")).toBe(false);
  });

  it("ouvre les deux espaces à l'admin, et aucun aux autres rôles", () => {
    expect(accedeEspaceCommission("ADMIN")).toBe(true);
    expect(accedeEspaceCoordination("ADMIN")).toBe(true);

    for (const role of ["REFERENT", "CHEF", undefined] as const) {
      expect(accedeEspaceCommission(role)).toBe(false);
      expect(accedeEspaceCoordination(role)).toBe(false);
    }
  });
});

describe("peutGererRemises", () => {
  it("réserve les remises de badges au Coordinateur et à l'admin", () => {
    expect(peutGererRemises("COORDINATEUR_NATIONAL")).toBe(true);
    expect(peutGererRemises("ADMIN")).toBe(true);

    for (const role of [
      "COMMISSION_FORMATION",
      "REFERENT",
      "CHEF",
      undefined,
    ] as const) {
      expect(peutGererRemises(role)).toBe(false);
    }
  });
});

describe("peutEvaluerEtape", () => {
  it("réserve l'évaluation de l'étape 3 à la commission Formation", () => {
    expect(peutEvaluerEtape("COMMISSION_FORMATION", 3, false)).toBe(true);
    expect(peutEvaluerEtape("COORDINATEUR_NATIONAL", 3, true)).toBe(false);
    expect(peutEvaluerEtape("ADMIN", 3, true)).toBe(false);
    expect(peutEvaluerEtape("REFERENT", 3, true)).toBe(false);
  });

  it("garde l'assignation comme règle sous l'étape 3", () => {
    expect(peutEvaluerEtape("REFERENT", 2, true)).toBe(true);
    expect(peutEvaluerEtape("REFERENT", 2, false)).toBe(false);
    expect(peutEvaluerEtape("COMMISSION_FORMATION", 2, false)).toBe(false);
    expect(peutEvaluerEtape("CHEF", 2, true)).toBe(false);
  });
});

describe("peutValiderEtape", () => {
  it("réserve la validation de l'étape 3 au Coordinateur National", () => {
    expect(peutValiderEtape("COORDINATEUR_NATIONAL", 3, false)).toBe(true);
    expect(peutValiderEtape("COMMISSION_FORMATION", 3, true)).toBe(false);
    expect(peutValiderEtape("ADMIN", 3, true)).toBe(false);
  });

  it("garde l'assignation comme règle sous l'étape 3", () => {
    expect(peutValiderEtape("REFERENT", 2, true)).toBe(true);
    expect(peutValiderEtape("COORDINATEUR_NATIONAL", 2, false)).toBe(false);
  });
});

describe("consulteEtape3", () => {
  it("ouvre l'Étape 3 aux rôles des deux espaces, admin compris", () => {
    expect(consulteEtape3("COMMISSION_FORMATION")).toBe(true);
    expect(consulteEtape3("COORDINATEUR_NATIONAL")).toBe(true);
    expect(consulteEtape3("ADMIN")).toBe(true);
    expect(consulteEtape3("REFERENT")).toBe(false);
    expect(consulteEtape3("CHEF")).toBe(false);
  });
});

describe("etapeSeGereParAssignation", () => {
  it("ne concerne que les badges des niveaux 1 et 2", () => {
    expect(etapeSeGereParAssignation({ type: "BADGE", niveau: 2 })).toBe(true);
    expect(etapeSeGereParAssignation({ type: "BADGE", niveau: 3 })).toBe(false);
  });

  it("exclut les jalons, validés par la lecture du livret", () => {
    expect(etapeSeGereParAssignation({ type: "JALON", niveau: 0 })).toBe(false);
    expect(etapeSeGereParAssignation({ type: "JALON", niveau: 3 })).toBe(false);
  });
});

describe("competenceSoumiseAEvaluation", () => {
  it("fait évaluer les compétences de l'étape 3 par la commission", () => {
    expect(competenceSoumiseAEvaluation(3)).toBe(true);
    expect(competenceSoumiseAEvaluation(2)).toBe(false);
  });
});
