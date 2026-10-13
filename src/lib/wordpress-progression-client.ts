import {
  appelerProfilWp,
  getWordpressCookieHeader,
  oublierSessionWp,
} from "@/lib/wordpress-auth";
import { avecCategories } from "@/lib/wordpress-progression";

type ResultatEcritureWp = { success: boolean; error?: string };

export function ecritureProgressionActive(): boolean {
  return process.env.WORDPRESS_PROGRESSION_WRITE === "true";
}

export function pousserProgressionVersWp(
  valeurs: string[],
): Promise<ResultatEcritureWp> {
  return ecrireProfilWp({ progression: avecCategories(valeurs) });
}

export function pousserGroupeVersWp(
  valeur: string,
): Promise<ResultatEcritureWp> {
  return ecrireProfilWp({ groupe: valeur });
}

async function ecrireProfilWp(corps: unknown): Promise<ResultatEcritureWp> {
  if (!ecritureProgressionActive()) {
    return {
      success: false,
      error:
        "L'écriture du profil sur la plateforme n'est pas encore disponible.",
    };
  }

  const cookieHeader = await getWordpressCookieHeader();

  if (!cookieHeader) {
    return { success: false, error: "Session WordPress introuvable." };
  }

  try {
    const res = await appelerProfilWp(cookieHeader, { corps });

    if (!res.ok) {
      return {
        success: false,
        error: `La plateforme a refusé la mise à jour (${res.status}).`,
      };
    }

    await oublierSessionWp();

    return { success: true };
  } catch {
    return { success: false, error: "Plateforme injoignable." };
  }
}
