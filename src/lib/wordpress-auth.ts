import { cache } from "react";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { parseWpProfile } from "@/lib/wordpress-profile";

const WP_URL = process.env.WORDPRESS_URL!;

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

async function fetchWpUser(): Promise<WpUser | null> {
  const store = await cookies();
  const all = store.getAll();

  if (!all.some((c) => c.name.startsWith("wordpress_logged_in"))) return null;

  const cookieHeader = all
    .filter((c) => c.name.startsWith("wordpress") || c.name.startsWith("wfwaf"))
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");

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

export const getCurrentUser = cache(async () => {
  const wp = await fetchWpUser();

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
        emailVerified: true,
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

  return { ...user, wp: parseWpProfile(wp) };
});
