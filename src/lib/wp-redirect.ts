import { origineApplication } from "@/lib/public-url";

function wordpressUrl(): string {
  const wpUrl = process.env.WORDPRESS_URL;

  if (!wpUrl) {
    throw new Error("WORDPRESS_URL is not set");
  }

  return wpUrl;
}

export function buildWpLoginUrl(returnTo?: string): string {
  const url = new URL("/wp-login.php", wordpressUrl());

  if (returnTo) {
    url.searchParams.set("redirect_to", returnTo);
  }

  return url.toString();
}

type DeconnexionWp = {
  logoutUrl?: string | null;
  nonce?: string | null;
};

export function buildWpLogoutUrl({
  logoutUrl,
  nonce,
}: DeconnexionWp = {}): string {
  const url =
    urlDeDeconnexionFournie(logoutUrl) ??
    new URL("/wp-login.php", wordpressUrl());

  url.searchParams.set("action", "logout");

  if (nonce && !url.searchParams.has("_wpnonce")) {
    url.searchParams.set("_wpnonce", nonce);
  }

  url.searchParams.set("redirect_to", `${origineApplication()}/`);

  return url.toString();
}

function urlDeDeconnexionFournie(logoutUrl?: string | null): URL | null {
  if (!logoutUrl) return null;

  try {
    const url = new URL(logoutUrl.replaceAll("&amp;", "&"));

    return url.origin === new URL(wordpressUrl()).origin ? url : null;
  } catch {
    return null;
  }
}

export function buildWpProfileUrl(): string {
  return new URL("/wp-admin/profile.php", wordpressUrl()).toString();
}
