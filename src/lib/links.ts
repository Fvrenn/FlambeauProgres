import { origineApplication } from "@/lib/public-url";

export function chefThreadUrl(justificationId: string): string {
  const params = new URLSearchParams({ justification: justificationId });

  return `${origineApplication()}/?${params.toString()}`;
}

export function referentThreadUrl(
  etapeId: string,
  justificationId: string,
): string {
  const params = new URLSearchParams({
    etapeId,
    justification: justificationId,
  });

  return `${origineApplication()}/referent/dashboard?${params.toString()}`;
}
