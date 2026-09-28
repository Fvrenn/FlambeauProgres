import type { WpTaxonomyEntry } from "@/lib/wordpress-profile";

import { createHash } from "crypto";

import { cache } from "react";
import { cookies } from "next/headers";

import { creerCacheMemoire } from "@/lib/cache-memoire";
import { prisma } from "@/lib/prisma";
import { parseWpProfile } from "@/lib/wordpress-profile";
import { WpProgressionService } from "@/services/wp-progression.service";

const WP_URL = process.env.WORDPRESS_URL!;
const DUREE_CACHE_SESSION_MS = 60_000;
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

export async function getSessionWp(): Promise<WpUser | null> {
  const cookieHeader = await getWordpressCookieHeader();

  if (!cookieHeader) return null;

  const cle = cleDeSession(cookieHeader);
  const enCache = sessionsWp.get(cle);

  if (enCache) return enCache;

  const wp = await lireUtilisateurWp(cookieHeader);

  if (wp) sessionsWp.set(cle, wp);

  return wp;
}

export async function fetchWpProgression(): Promise<WpTaxonomyEntry[] | null> {
  const cookieHeader = await getWordpressCookieHeader();

  if (!cookieHeader) return null;

  const wp = await lireUtilisateurWp(cookieHeader);

  return Array.isArray(wp?.progression) ? wp.progression : null;
}

export async function oublierSessionWp(): Promise<void> {
  const cookieHeader = await getWordpressCookieHeader();

  if (cookieHeader) sessionsWp.delete(cleDeSession(cookieHeader));
}

async function lireUtilisateurWp(cookieHeader: string): Promise<WpUser | null> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/flbx/v1/user-info?_wpnonce=1`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

function cleDeSession(cookieHeader: string): string {
  return createHash("sha256").update(cookieHeader).digest("hex");
}

export const getCurrentUser = cache(async () => {
  const wp = await getSessionWp();

  if (!wp) return null;

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
