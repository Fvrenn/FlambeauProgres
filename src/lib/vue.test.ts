import type { SessionUser } from "@/types";

import { describe, it, expect } from "vitest";

import { adminSidebarItems, chefSidebarItems } from "@/config/navigation";
import {
  lireVue,
  sidebarItemsPourVue,
  sidebarsParVue,
  vueDepuisChemin,
} from "@/lib/vue";

const utilisateur = (role: SessionUser["role"]): SessionUser => ({
  id: "u1",
  name: "Test",
  email: "t@t.fr",
  role,
  etapesReferent: [],
});

describe("vueDepuisChemin", () => {
  it("reconnaît les cinq vues", () => {
    expect(vueDepuisChemin("/admin/users")).toBe("admin");
    expect(vueDepuisChemin("/referent/dashboard")).toBe("referent");
    expect(vueDepuisChemin("/commission/suivi")).toBe("commission");
    expect(vueDepuisChemin("/coordination/validations")).toBe("coordination");
    expect(vueDepuisChemin("/")).toBe("chef");
    expect(vueDepuisChemin("/progression")).toBe("chef");
    expect(vueDepuisChemin("/formation")).toBe("chef");
  });

  it("ne rattache le profil et la page de bug à aucune vue", () => {
    expect(vueDepuisChemin("/profil")).toBeNull();
    expect(vueDepuisChemin("/signaler-un-bug")).toBeNull();
  });

  it("ne confond pas une route qui commence par le même mot", () => {
    expect(vueDepuisChemin("/formations-archive")).toBeNull();
    expect(vueDepuisChemin("/administration")).toBeNull();
  });
});

describe("lireVue", () => {
  it("retombe sur la vue Chef pour une valeur absente ou inconnue", () => {
    expect(lireVue(undefined)).toBe("chef");
    expect(lireVue("superadmin")).toBe("chef");
    expect(lireVue("admin")).toBe("admin");
    expect(lireVue("commission")).toBe("commission");
    expect(lireVue("coordination")).toBe("coordination");
  });
});

describe("sidebarItemsPourVue", () => {
  it("affiche la navigation de la vue retenue quand le rôle le permet", () => {
    expect(sidebarItemsPourVue("admin", utilisateur("ADMIN"))).toBe(
      adminSidebarItems,
    );
  });

  it("ne montre jamais la navigation admin à un chef", () => {
    expect(sidebarItemsPourVue("admin", utilisateur("CHEF"))).toBe(
      chefSidebarItems,
    );
  });

  it("donne la navigation référent à un référent", () => {
    const items = sidebarItemsPourVue("referent", utilisateur("REFERENT"));

    expect(items.map((item) => item.key)).toEqual([
      "referent",
      "referent-suivi",
    ]);
  });
});

describe("sidebarItemsPourVue — vue Référent", () => {
  it("n'ajoute plus l'Étape 3 à la commission ni au Coordinateur", () => {
    for (const role of [
      "COMMISSION_FORMATION",
      "COORDINATEUR_NATIONAL",
    ] as const) {
      const items = sidebarItemsPourVue("referent", utilisateur(role));

      expect(items.map((item) => item.key)).toEqual([
        "referent",
        "referent-suivi",
      ]);
    }
  });
});

describe("sidebarsParVue", () => {
  it("prépare la navigation de chaque vue, bornée au rôle", () => {
    const sidebars = sidebarsParVue(utilisateur("CHEF"));

    for (const items of Object.values(sidebars)) {
      expect(items).toBe(chefSidebarItems);
    }
  });

  it("transmet chaque compteur à son espace", () => {
    const sidebars = sidebarsParVue(utilisateur("ADMIN"), {
      evaluations: 4,
      validations: 2,
    });

    expect(sidebars.commission[0]).toMatchObject({
      key: "commission-evaluations",
      compteur: 4,
    });
    expect(sidebars.coordination[0]).toMatchObject({
      key: "coordination-validations",
      compteur: 2,
    });
  });
});

describe("espaces Commission et Coordination", () => {
  it("réserve chaque espace à son rôle, et ouvre les deux à l'admin", () => {
    const keys = (
      vue: "commission" | "coordination",
      role: SessionUser["role"],
    ) => sidebarItemsPourVue(vue, utilisateur(role)).map((item) => item.key);

    expect(keys("commission", "COMMISSION_FORMATION")).toEqual([
      "commission-evaluations",
      "commission-suivi",
    ]);
    expect(keys("coordination", "COORDINATEUR_NATIONAL")).toEqual([
      "coordination-validations",
      "coordination-suivi",
    ]);
    expect(keys("commission", "ADMIN")).toContain("commission-evaluations");
    expect(keys("coordination", "ADMIN")).toContain("coordination-validations");
  });

  it("ferme l'espace de l'autre rôle", () => {
    expect(
      sidebarItemsPourVue("commission", utilisateur("COORDINATEUR_NATIONAL")),
    ).toBe(chefSidebarItems);
    expect(
      sidebarItemsPourVue("coordination", utilisateur("COMMISSION_FORMATION")),
    ).toBe(chefSidebarItems);
  });

  it("n'ouvre aucun des deux aux référents et aux chefs", () => {
    for (const role of ["REFERENT", "CHEF"] as const) {
      expect(sidebarItemsPourVue("commission", utilisateur(role))).toBe(
        chefSidebarItems,
      );
      expect(sidebarItemsPourVue("coordination", utilisateur(role))).toBe(
        chefSidebarItems,
      );
    }
  });
});
