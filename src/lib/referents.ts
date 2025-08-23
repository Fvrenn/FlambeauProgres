import type { Referent } from "@/src/types/referent";

export async function getReferents(): Promise<Referent[]> {
  const res = await fetch("/api/referent", {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Échec du fetch référents: ${res.status} - ${errorData}`);
  }
  return await res.json();
}