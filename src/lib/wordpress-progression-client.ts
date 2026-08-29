import { getWordpressCookieHeader } from "@/lib/wordpress-auth";

const WP_URL = process.env.WORDPRESS_URL!;

export type ResultatEcritureWp = { success: boolean; error?: string };

export function ecritureProgressionActive(): boolean {
  return process.env.WORDPRESS_PROGRESSION_WRITE === "true";
}

export async function pousserProgressionVersWp(
  valeurs: string[],
): Promise<ResultatEcritureWp> {
  if (!ecritureProgressionActive()) {
    return {
      success: false,
      error:
        "L'écriture de la progression sur la plateforme n'est pas encore disponible.",
    };
  }

  const cookieHeader = await getWordpressCookieHeader();

  if (!cookieHeader) {
    return { success: false, error: "Session WordPress introuvable." };
  }

  try {
    const res = await fetch(`${WP_URL}/wp-json/flbx/v1/user-info?_wpnonce=1`, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
        "content-type": "application/json",
      },
      body: JSON.stringify({ progression: valeurs }),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        success: false,
        error: `La plateforme a refusé la mise à jour (${res.status}).`,
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Plateforme injoignable." };
  }
}
