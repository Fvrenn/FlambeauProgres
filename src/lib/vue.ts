import type { SessionUser } from "@/types";
import type { SidebarItem } from "@/components/application/sidebar/sidebar";

import {
  adminSidebarItems,
  chefSidebarItems,
  referentSidebarItems,
} from "@/config/navigation";
import { estAdmin, estReferent } from "@/lib/roles";

export type Vue = "chef" | "referent" | "admin";

export const COOKIE_DERNIERE_VUE = "derniere-vue";

const RACINES_DES_VUES: [string, Vue][] = [
  ["/admin", "admin"],
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
  return valeur === "referent" || valeur === "admin" ? valeur : "chef";
}

export function sidebarItemsPourVue(
  vue: Vue,
  user: SessionUser,
): SidebarItem[] {
  if (vue === "admin" && estAdmin(user.role)) {
    return adminSidebarItems;
  }

  if (vue === "referent" && estReferent(user.role)) {
    return referentSidebarItems(user);
  }

  return chefSidebarItems;
}

function estSousChemin(chemin: string, racine: string): boolean {
  return chemin === racine || chemin.startsWith(`${racine}/`);
}
