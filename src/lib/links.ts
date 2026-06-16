const APP_URL =
  process.env.APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";

export function chefThreadUrl(justificationId: string): string {
  const params = new URLSearchParams({ justification: justificationId });

  return `${APP_URL}/?${params.toString()}`;
}

export function referentThreadUrl(
  etapeId: string,
  justificationId: string,
): string {
  const params = new URLSearchParams({
    etapeId,
    justification: justificationId,
  });

  return `${APP_URL}/referent/dashboard?${params.toString()}`;
}
