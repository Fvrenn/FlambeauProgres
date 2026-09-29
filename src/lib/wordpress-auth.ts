import type { WpTaxonomyEntry } from "@/lib/wordpress-profile";

import { createHash } from "crypto";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { creerCacheMemoire } from "@/lib/cache-memoire";
import { prisma } from "@/lib/prisma";
import { parseWpProfile } from "@/lib/wordpress-profile";
import { WpProgressionService } from "@/services/wp-progression.service";
import { ROUTE_NON_MEMBRE } from "@/config/navigation";

const WP_URL = process.env.WORDPRESS_URL!;
const DUREE_CACHE_SESSION_MS = 60_000;
const CODE_NON_MEMBRE = "flbx_not_member";
const NOMBRE_MAX_SESSIONS_EN_CACHE = 1000;

const sessionsWp = creerCacheMemoire<WpUser>({
  dureeMs: DUREE_CACHE_SESSION_MS,
  tailleMax: NOMBRE_MAX_SESSIONS_EN_CACHE,
});

type WpUser = {
  id: number;
  nickname: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  group: string;
  fonction: { value: string; label: string }[];
  progression: { value: string; label: string }[];
  logout_nonce?: string;
};

export async function getWordpressCookieHeader(): Promise<string | null> {
  const store = await cookies();
  const all = store.getAll();

  if (!all.some((c) => c.name.startsWith("wordpress_logged_in"))) return null;

  return all
    .filter((c) => c.name.startsWith("wordpress") || c.name.startsWith("wfwaf"))
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");
}

export type SessionWp =
  | { statut: "connecte"; wp: WpUser }
  | { statut: "non-membre" }
  | { statut: "anonyme" };

export async function getSessionWp(): Promise<SessionWp> {
  const cookieHeader = await getWordpressCookieHeader();

  if (!cookieHeader) return { statut: "anonyme" };

  const cle = cleDeSession(cookieHeader);
  const enCache = sessionsWp.get(cle);

  if (enCache) return { statut: "connecte", wp: enCache };

  const session = await lireSessionWp(cookieHeader);

  if (session.statut === "connecte") sessionsWp.set(cle, session.wp);

  return session;
}

export async function fetchWpProgression(): Promise<WpTaxonomyEntry[] | null> {
  const cookieHeader = await getWordpressCookieHeader();

  if (!cookieHeader) return null;

  const session = await lireSessionWp(cookieHeader);

  return session.statut === "connecte" && Array.isArray(session.wp.progression)
    ? session.wp.progression
    : null;
}

export async function oublierSessionWp(): Promise<void> {
  const cookieHeader = await getWordpressCookieHeader();

  if (cookieHeader) sessionsWp.delete(cleDeSession(cookieHeader));
}

export function appelerProfilWp(
  cookieHeader: string,
  ecriture?: { corps: unknown },
): Promise<Response> {
  return fetch(`${WP_URL}/wp-json/flbx/v1/user-info`, {
    method: ecriture ? "POST" : "GET",
    headers: {
      cookie: cookieHeader,
      "X-WP-Nonce": "x",
      ...(ecriture ? { "content-type": "application/json" } : {}),
    },
    body: ecriture ? JSON.stringify(ecriture.corps) : undefined,
    redirect: "manual",
    cache: "no-store",
  });
}

async function lireSessionWp(cookieHeader: string): Promise<SessionWp> {
  try {
    const res = await appelerProfilWp(cookieHeader);

    if (res.ok) {
      return { statut: "connecte", wp: await res.json() };
    }

    if (res.status === 401) {
      const erreur = await res.json().catch(() => null);

      if (erreur?.code === CODE_NON_MEMBRE) {
        return { statut: "non-membre" };
      }
    }

    return { statut: "anonyme" };
  } catch {
    return { statut: "anonyme" };
  }
}

function cleDeSession(cookieHeader: string): string {
  return createHash("sha256").update(cookieHeader).digest("hex");
}

export const getCurrentUser = cache(async () => {
  const session = await getSessionWp();

  if (session.statut === "non-membre") {
    redirect(ROUTE_NON_MEMBRE);
  }

  if (session.statut !== "connecte") return null;

  const { wp } = session;

  const displayName =
    [wp.first_name, wp.last_name].filter(Boolean).join(" ").trim() ||
    wp.nickname;

  let user = await prisma.user.findUnique({ where: { wpUserId: wp.id } });

  if (!user) {
    const byEmail = await prisma.user.findUnique({
      where: { email: wp.email },
    });

    if (byEmail) {
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: { wpUserId: wp.id, name: displayName },
      });
    }
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        wpUserId: wp.id,
        email: wp.email,
        name: displayName,
        image: wp.avatar_url,
      },
    });
  } else if (
    user.email !== wp.email ||
    user.name !== displayName ||
    user.image !== wp.avatar_url
  ) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { email: wp.email, name: displayName, image: wp.avatar_url },
    });
  }

  const profile = parseWpProfile(wp);

  if (Array.isArray(wp.progression)) {
    await WpProgressionService.synchroniserSiNecessaire(
      user.id,
      profile.progressionEntries,
      user.wpProgressionSyncAt,
    );
  }

  return { ...user, wp: profile };
});
