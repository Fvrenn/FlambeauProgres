import type { SessionUser } from "@/types";
import type { SidebarItem } from "@/components/application/sidebar/sidebar";

import {
  adminSidebarItems,
  chefSidebarItems,
  commissionSidebarItems,
  coordinationSidebarItems,
  referentSidebarItems,
} from "@/config/navigation";
import {
  accedeEspaceCommission,
  accedeEspaceCoordination,
  estAdmin,
  estReferent,
} from "@/lib/roles";

export type Vue = "chef" | "referent" | "commission" | "coordination" | "admin";

export type CompteursEncadrement = { evaluations: number; validations: number };

const VUES: Vue[] = ["chef", "referent", "commission", "coordination", "admin"];

const AUCUN_COMPTEUR: CompteursEncadrement = { evaluations: 0, validations: 0 };

export const COOKIE_DERNIERE_VUE = "derniere-vue";

const RACINES_DES_VUES: [string, Vue][] = [
  ["/admin", "admin"],
  ["/commission", "commission"],
  ["/coordination", "coordination"],
  ["/referent", "referent"],
  ["/progression", "chef"],
  ["/formation", "chef"],
];

export function vueDepuisChemin(chemin: string): Vue | null {
  if (chemin === "/") {
    return "chef";
  }

  const racine = RACINES_DES_VUES.find(([prefixe]) =>
    estSousChemin(chemin, prefixe),
  );

  return racine ? racine[1] : null;
}

export function lireVue(valeur: string | undefined): Vue {
  return VUES.find((vue) => vue === valeur) ?? "chef";
}

export function sidebarItemsPourVue(
  vue: Vue,
  user: SessionUser,
  compteurs: CompteursEncadrement = AUCUN_COMPTEUR,
): SidebarItem[] {
  if (vue === "admin" && estAdmin(user.role)) {
    return adminSidebarItems;
  }

  if (vue === "commission" && accedeEspaceCommission(user.role)) {
    return commissionSidebarItems(compteurs.evaluations);
  }

  if (vue === "coordination" && accedeEspaceCoordination(user.role)) {
    return coordinationSidebarItems(compteurs.validations);
  }

  if (vue === "referent" && estReferent(user.role)) {
    return referentSidebarItems(user);
  }

  return chefSidebarItems;
}

export function sidebarsParVue(
  user: SessionUser,
  compteurs: CompteursEncadrement = AUCUN_COMPTEUR,
): Record<Vue, SidebarItem[]> {
  return Object.fromEntries(
    VUES.map((vue) => [vue, sidebarItemsPourVue(vue, user, compteurs)]),
  ) as Record<Vue, SidebarItem[]>;
}

function estSousChemin(chemin: string, racine: string): boolean {
  return chemin === racine || chemin.startsWith(`${racine}/`);
}
