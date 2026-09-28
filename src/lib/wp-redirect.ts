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

export function buildWpLogoutUrl(): string {
  const url = new URL("/wp-login.php", wordpressUrl());

  url.searchParams.set("action", "logout");
  url.searchParams.set("redirect_to", `${origineApplication()}/`);

  return url.toString();
}

export function buildWpProfileUrl(): string {
  return new URL("/wp-admin/profile.php", wordpressUrl()).toString();
}
