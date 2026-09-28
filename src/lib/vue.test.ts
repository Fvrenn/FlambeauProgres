import type { SessionUser } from "@/types";

import { describe, it, expect } from "vitest";

import { adminSidebarItems, chefSidebarItems } from "@/config/navigation";
import { lireVue, sidebarItemsPourVue, vueDepuisChemin } from "@/lib/vue";

const utilisateur = (role: SessionUser["role"]): SessionUser => ({
  id: "u1",
  name: "Test",
  email: "t@t.fr",
  role,
  etapesReferent: [],
});

describe("vueDepuisChemin", () => {
  it("reconnaît les trois vues", () => {
    expect(vueDepuisChemin("/admin/users")).toBe("admin");
    expect(vueDepuisChemin("/referent/dashboard")).toBe("referent");
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

    expect(items.map((item) => item.key)).toEqual(["referent", "analyse"]);
  });
});
