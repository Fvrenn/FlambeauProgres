export function buildWpLoginUrl(returnTo?: string): string {
  const wpUrl = process.env.WORDPRESS_URL;

  if (!wpUrl) {
    throw new Error("WORDPRESS_URL is not set");
  }

  const url = new URL("/wp-login.php", wpUrl);

  if (returnTo) {
    url.searchParams.set("redirect_to", returnTo);
  }

  return url.toString();
}
